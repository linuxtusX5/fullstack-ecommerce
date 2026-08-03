"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Share2,
  Check,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: { id: string; name: string; slug: string };
};
import { VariantSelector } from "@/components/product/VariantSelector";

type Props = { product: Product };

export function ProductInfo({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isInCart = useCartStore((s) => s.isInCart);
  const inCart = isInCart(product.id);
  const outOfStock = product.stock === 0;
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState(product.price);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        slug: product.slug,
        category: product.category,
      },
      qty,
      selectedVariant
        ? {
            id: selectedVariant.id,
            label: [selectedVariant.size, selectedVariant.color]
              .filter(Boolean)
              .join(" / "),
          }
        : undefined,
    );
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2500);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Sora:wght@300;400;500;600;700&display=swap');

          .pi-root {
            font-family: 'Sora', sans-serif;
            position: sticky;
            top: 96px;
            display: flex;
            flex-direction: column;
            gap: 28px;
          }

          /* Top row */
          .pi-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }

          .pi-category {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #0ea5e9;
            text-decoration: none;
            transition: opacity 0.2s;
          }
          .pi-category:hover { opacity: 0.7; }

          .pi-actions-top {
            display: flex;
            gap: 8px;
          }

          .pi-icon-btn {
            width: 36px; height: 36px;
            border-radius: 50%;
            border: 1.5px solid #e2e8f0;
            background: #fff;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            color: #64748b;
            transition: all 0.2s;
          }

          .pi-icon-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
          .pi-icon-btn-active { border-color: #ef4444 !important; color: #ef4444 !important; }

          /* Name */
          .pi-name {
            font-family: 'Playfair Display', serif;
            font-size: clamp(24px, 3.5vw, 36px);
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.02em;
            line-height: 1.15;
          }

          /* Price */
          .pi-price-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .pi-price {
            font-size: 28px;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          /* Stock */
          .pi-stock {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 100px;
          }

          .pi-stock-in {
            background: #f0fdf4;
            color: #16a34a;
          }

          .pi-stock-low {
            background: #fff7ed;
            color: #ea580c;
          }

          .pi-stock-out {
            background: #fef2f2;
            color: #dc2626;
          }

          .pi-stock-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: currentColor;
          }

          /* Divider */
          .pi-divider {
            height: 1px;
            background: #f1f5f9;
            border: none;
            margin: 0;
          }

          /* Description */
          .pi-desc {
            font-size: 14px;
            font-weight: 300;
            color: #475569;
            line-height: 1.75;
          }

          /* Quantity */
          .pi-qty-label {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 10px;
          }

          .pi-qty-row {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .pi-qty-ctrl {
            display: flex;
            align-items: center;
            gap: 0;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
          }

          .pi-qty-btn {
            width: 40px; height: 44px;
            border: none; background: none;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #374151;
            transition: background 0.15s;
            flex-shrink: 0;
          }

          .pi-qty-btn:hover:not(:disabled) { background: #f8fafc; }
          .pi-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }

          .pi-qty-val {
            width: 44px;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
            border-left: 1.5px solid #e2e8f0;
            border-right: 1.5px solid #e2e8f0;
            line-height: 44px;
          }

          .pi-qty-max {
            font-size: 12px;
            color: #94a3b8;
          }

          /* Add to cart */
          .pi-cta {
            display: flex;
            gap: 10px;
          }

          .pi-add-btn {
            flex: 1;
            height: 52px;
            border: none;
            border-radius: 14px;
            font-family: 'Sora', sans-serif;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.25s;
            letter-spacing: 0.02em;
          }

          .pi-add-btn-default {
            background: #0f172a;
            color: #fff;
          }

          .pi-add-btn-default:hover {
            background: #1e293b;
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(15,23,42,0.25);
          }

          .pi-add-btn-success {
            background: #16a34a;
            color: #fff;
          }

          .pi-add-btn-disabled {
            background: #f1f5f9;
            color: #94a3b8;
            cursor: not-allowed;
          }

          /* Trust badges */
          .pi-trust {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 14px;
            border: 1px solid #f1f5f9;
          }

          .pi-trust-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: #475569;
          }

          .pi-trust-icon {
            width: 32px; height: 32px;
            border-radius: 8px;
            background: #fff;
            border: 1px solid #e2e8f0;
            display: flex; align-items: center; justify-content: center;
            color: #0ea5e9;
            flex-shrink: 0;
          }

          .pi-trust-item strong {
            display: block;
            font-weight: 600;
            color: #0f172a;
            font-size: 12px;
            margin-bottom: 1px;
          }

          @keyframes piSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .pi-root { animation: piSlideIn 0.4s ease both; }
        `}</style>

      <div className="pi-root">
        {/* Category + actions */}
        <div className="pi-top">
          <a
            href={`/products?category=${product.category.slug}`}
            className="pi-category"
          >
            {product.category.name}
          </a>
          <div className="pi-actions-top">
            <WishlistButton productId={product.id} size="sm" />
            <button
              className="pi-icon-btn"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Name */}
        <h1 className="pi-name">{product.name}</h1>

        {/* Price + stock */}
        <div className="pi-price-row">
          <span className="pi-price">${product.price.toFixed(2)}</span>
          <span
            className={`pi-stock ${
              outOfStock
                ? "pi-stock-out"
                : product.stock <= 5
                  ? "pi-stock-low"
                  : "pi-stock-in"
            }`}
          >
            <span className="pi-stock-dot" />
            {outOfStock
              ? "Out of stock"
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : "In stock"}
          </span>
        </div>

        <hr className="pi-divider" />
        <VariantSelector
          productId={product.id}
          basePrice={product.price}
          onVariantChange={(variant, price) => {
            setSelectedVariant(variant);
            setCurrentPrice(price);
          }}
        />

        {/* Description */}
        <p className="pi-desc">{product.description}</p>

        <hr className="pi-divider" />

        {/* Quantity */}
        {!outOfStock && (
          <div>
            <p className="pi-qty-label">Quantity</p>
            <div className="pi-qty-row">
              <div className="pi-qty-ctrl">
                <button
                  className="pi-qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="pi-qty-val">{qty}</span>
                <button
                  className="pi-qty-btn"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  aria-label="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="pi-qty-max">{product.stock} available</span>
            </div>
          </div>
        )}

        {/* Add to cart */}
        <div className="pi-cta">
          <button
            className={`pi-add-btn ${
              outOfStock
                ? "pi-add-btn-disabled"
                : added
                  ? "pi-add-btn-success"
                  : "pi-add-btn-default"
            }`}
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {added ? (
              <>
                <Check size={16} /> Added to bag
              </>
            ) : outOfStock ? (
              "Out of stock"
            ) : (
              <>
                <ShoppingBag size={16} /> Add to bag
              </>
            )}
          </button>
        </div>
        {/* Trust badges */}
        <div className="pi-trust">
          <div className="pi-trust-item">
            <span className="pi-trust-icon">
              <Truck size={15} />
            </span>
            <div>
              <strong>Free shipping over $100</strong>
              Estimated delivery in 3–5 business days
            </div>
          </div>
          <div className="pi-trust-item">
            <span className="pi-trust-icon">
              <RotateCcw size={15} />
            </span>
            <div>
              <strong>30-day returns</strong>
              Free returns on all orders
            </div>
          </div>
          <div className="pi-trust-item">
            <span className="pi-trust-icon">
              <Shield size={15} />
            </span>
            <div>
              <strong>Secure checkout</strong>
              SSL encrypted & safe payment
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
