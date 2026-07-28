"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const cartCount = mounted ? totalItems : 0;
  const cartItems = mounted ? items : [];

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

        /* Backdrop */
        .cd-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(15,23,42,0.5);
          backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .cd-backdrop-open { opacity: 1; pointer-events: all; }

        /* Drawer */
        .cd-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 100%; max-width: 420px;
          background: #fff;
          z-index: 1000;
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          box-shadow: -20px 0 60px rgba(15,23,42,0.15);
        }
        .cd-drawer-open { transform: translateX(0); }

        /* Header */
        .cd-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }

        .cd-header-left {
          display: flex; align-items: center; gap: 10px;
        }

        .cd-title {
          font-family: 'Sora', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.02em;
        }

        .cd-count {
          background: #0ea5e9; color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 700;
          min-width: 20px; height: 20px;
          border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 6px;
        }

        .cd-close {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1.5px solid #e2e8f0;
          background: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: all 0.2s;
        }
        .cd-close:hover { border-color: #0f172a; color: #0f172a; }

        /* Items list */
        .cd-items {
          flex: 1; overflow-y: auto;
          padding: 16px 24px;
          display: flex; flex-direction: column; gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }

        /* Cart item */
        .cd-item {
          display: grid;
          grid-template-columns: 72px 1fr;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f8fafc;
        }

        .cd-item:last-child { border-bottom: none; padding-bottom: 0; }

        .cd-item-img {
          width: 72px; height: 88px;
          border-radius: 10px; overflow: hidden;
          background: #f1f5f9; flex-shrink: 0;
        }

        .cd-item-img img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.3s;
        }

        .cd-item-img:hover img { transform: scale(1.05); }

        .cd-item-body {
          display: flex; flex-direction: column;
          justify-content: space-between; min-width: 0;
        }

        .cd-item-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px;
        }

        .cd-item-name {
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #0f172a; line-height: 1.3;
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
        }
        .cd-item-name:hover { color: #0ea5e9; }

        .cd-item-remove {
          background: none; border: none; cursor: pointer;
          color: #cbd5e1; padding: 2px;
          transition: color 0.2s; flex-shrink: 0;
        }
        .cd-item-remove:hover { color: #ef4444; }

        .cd-item-variant {
          font-family: 'Sora', sans-serif;
          font-size: 11px; color: #94a3b8;
          margin-top: 2px;
        }

        .cd-item-bottom {
          display: flex; align-items: center;
          justify-content: space-between; margin-top: 8px;
        }

        .cd-item-price {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #0f172a;
        }

        /* Qty control */
        .cd-qty {
          display: flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          overflow: hidden;
        }

        .cd-qty-btn {
          width: 28px; height: 28px;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #374151; transition: background 0.15s;
        }
        .cd-qty-btn:hover:not(:disabled) { background: #f8fafc; }
        .cd-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .cd-qty-val {
          width: 32px; text-align: center;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #0f172a;
          border-left: 1.5px solid #e2e8f0;
          border-right: 1.5px solid #e2e8f0;
          line-height: 28px;
        }

        /* Empty state */
        .cd-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; padding: 40px 24px; text-align: center;
        }

        .cd-empty-icon {
          width: 64px; height: 64px;
          background: #f8fafc; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #cbd5e1;
        }

        .cd-empty-title {
          font-family: 'Sora', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #0f172a;
        }

        .cd-empty-sub {
          font-family: 'Sora', sans-serif;
          font-size: 13px; color: #94a3b8;
          font-weight: 300;
        }

        .cd-empty-btn {
          margin-top: 8px;
          display: inline-flex; align-items: center; gap: 8px;
          height: 44px; padding: 0 24px;
          background: #0f172a; color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          border-radius: 10px; text-decoration: none;
          transition: all 0.2s;
        }
        .cd-empty-btn:hover { background: #1e293b; }

        /* Footer */
        .cd-footer {
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
          background: #fafaf9;
          flex-shrink: 0;
        }

        .cd-summary {
          display: flex; flex-direction: column; gap: 8px;
          margin-bottom: 16px;
        }

        .cd-summary-row {
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'Sora', sans-serif; font-size: 13px; color: #64748b;
        }

        .cd-summary-row span:last-child { font-weight: 600; color: #0f172a; }

        .cd-summary-total {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 10px; border-top: 1px solid #e2e8f0;
          font-family: 'Sora', sans-serif;
        }

        .cd-summary-total span:first-child {
          font-size: 14px; font-weight: 700; color: #0f172a;
        }

        .cd-total-price {
          font-size: 20px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.03em;
        }

        .cd-checkout-btn {
          width: 100%; height: 50px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .cd-checkout-btn:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.25);
        }

        .cd-view-cart {
          display: block; text-align: center; margin-top: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 500;
          color: #64748b; text-decoration: none;
          transition: color 0.2s;
        }
        .cd-view-cart:hover { color: #0ea5e9; }

        .cd-clear {
          display: flex; align-items: center; justify-content: flex-end;
          margin-bottom: 8px;
        }

        .cd-clear-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 500; color: #94a3b8;
          display: flex; align-items: center; gap: 4px;
          padding: 0; transition: color 0.2s;
        }
        .cd-clear-btn:hover { color: #ef4444; }

        @keyframes cdItemIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cd-item { animation: cdItemIn 0.25s ease both; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`cd-backdrop ${isOpen ? "cd-backdrop-open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`cd-drawer ${isOpen ? "cd-drawer-open" : ""}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="cd-header">
          <div className="cd-header-left">
            <ShoppingBag size={18} color="#0f172a" />
            <span className="cd-title">Your Bag</span>
            {cartCount > 0 && <span className="cd-count">{cartCount}</span>}
          </div>
          <button
            className="cd-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="cd-empty">
            <div className="cd-empty-icon">
              <ShoppingBag size={28} />
            </div>
            <p className="cd-empty-title">Your bag is empty</p>
            <p className="cd-empty-sub">
              Add something you love to get started.
            </p>
            <Link href="/products" className="cd-empty-btn" onClick={closeCart}>
              Browse products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cd-items">
              {items.length > 1 && (
                <div className="cd-clear">
                  <button className="cd-clear-btn" onClick={clearCart}>
                    <Trash2 size={11} /> Clear all
                  </button>
                </div>
              )}

              {cartItems.map((item, i) => (
                <div
                  key={item.id}
                  className="cd-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={closeCart}
                  >
                    <div className="cd-item-img">
                      <img
                        src={item.product.images?.[0] ?? "/placeholder.jpg"}
                        alt={item.product.name}
                      />
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="cd-item-body">
                    <div className="cd-item-top">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="cd-item-name"
                        onClick={closeCart}
                      >
                        {item.product.name}
                      </Link>
                      <button
                        className="cd-item-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {item.variantLabel && (
                      <p className="cd-item-variant">{item.variantLabel}</p>
                    )}

                    <div className="cd-item-bottom">
                      {/* Qty */}
                      <div className="cd-qty">
                        <button
                          className="cd-qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cd-qty-val">{item.quantity}</span>
                        <button
                          className="cd-qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="cd-item-price">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cd-footer">
              <div className="cd-summary">
                <div className="cd-summary-row">
                  <span>
                    Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                  </span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="cd-summary-row">
                  <span>Shipping</span>
                  <span>{totalPrice >= 100 ? "Free" : "$9.99"}</span>
                </div>
                <div className="cd-summary-total">
                  <span>Total</span>
                  <span className="cd-total-price">
                    $
                    {(totalPrice >= 100
                      ? totalPrice
                      : totalPrice + 9.99
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="cd-checkout-btn"
                onClick={closeCart}
              >
                Checkout <ArrowRight size={16} />
              </Link>
              <Link href="/cart" className="cd-view-cart" onClick={closeCart}>
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
