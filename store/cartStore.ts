import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  category: { name: string };
};

export type CartItem = {
  id: string; // unique cart row id  = productId + variantId
  productId: string;
  variantId?: string;
  variantLabel?: string; // e.g. "Red / XL"
  quantity: number;
  product: CartProduct;
};

type CartStore = {
  // ── State ──
  items: CartItem[];
  isOpen: boolean;

  // ── Actions ──
  addItem: (
    product: CartProduct,
    quantity?: number,
    variant?: { id: string; label: string },
  ) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // ── Derived ──
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSavings: () => number;
  isInCart: (productId: string, variantId?: string) => boolean;
  getItemQuantity: (productId: string, variantId?: string) => number;
};

// ── Helper ────────────────────────────────────────────────────────────────────

function makeCartId(productId: string, variantId?: string) {
  return variantId ? `${productId}__${variantId}` : productId;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // ── addItem ──────────────────────────────────────────────────────────
      addItem: (product, quantity = 1, variant) => {
        const cartId = makeCartId(product.id, variant?.id);

        set((state) => {
          const existing = state.items.find((i) => i.id === cartId);

          if (existing) {
            const newQty = Math.min(
              existing.quantity + quantity,
              product.stock,
            );
            return {
              items: state.items.map((i) =>
                i.id === cartId ? { ...i, quantity: newQty } : i,
              ),
            };
          }

          const newItem: CartItem = {
            id: cartId,
            productId: product.id,
            variantId: variant?.id,
            variantLabel: variant?.label,
            quantity: Math.min(quantity, product.stock),
            product,
          };

          return { items: [...state.items, newItem] };
        });
      },

      // ── removeItem ───────────────────────────────────────────────────────
      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== cartId),
        }));
      },

      // ── updateQuantity ───────────────────────────────────────────────────
      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== cartId) return i;
            return { ...i, quantity: Math.min(quantity, i.product.stock) };
          }),
        }));
      },

      // ── clearCart ────────────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── drawer ───────────────────────────────────────────────────────────
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ── getTotalItems ────────────────────────────────────────────────────
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      // ── getTotalPrice ────────────────────────────────────────────────────
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      // ── getSavings ───────────────────────────────────────────────────────
      getSavings: () =>
        get().items.reduce((sum, i) => {
          if (!i.product.comparePrice) return sum;
          const saving =
            (i.product.comparePrice - i.product.price) * i.quantity;
          return sum + Math.max(0, saving);
        }, 0),

      // ── isInCart ─────────────────────────────────────────────────────────
      isInCart: (productId, variantId) => {
        const cartId = makeCartId(productId, variantId);
        return get().items.some((i) => i.id === cartId);
      },

      // ── getItemQuantity ──────────────────────────────────────────────────
      getItemQuantity: (productId, variantId) => {
        const cartId = makeCartId(productId, variantId);
        return get().items.find((i) => i.id === cartId)?.quantity ?? 0;
      },
    }),

    {
      name: "cart-guest", // overridden per user in CartInitializer
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// ── Per-user cart init ────────────────────────────────────────────────────────
// Call this whenever the session changes (sign in / sign out)

export async function initCartForUser(userId?: string | null) {
  const key = userId ? `cart-${userId}` : "cart-guest";
  useCartStore.persist.setOptions({ name: key });
  await useCartStore.persist.rehydrate();
}
