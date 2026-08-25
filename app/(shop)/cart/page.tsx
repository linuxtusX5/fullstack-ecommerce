"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const discountAmt = discount;
  const total = Math.max(subtotal - discountAmt + shipping, 0);

  const handleCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = coupon.trim();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to apply coupon.");
      }

      setDiscount(Number(data.discount) || 0);
      setAppliedCode(String(data.code || code.toUpperCase()));
      setCoupon("");
    } catch (error) {
      setDiscount(0);
      setAppliedCode("");
      setCouponError(
        error instanceof Error ? error.message : "Invalid coupon code.",
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCode("");
    setCouponError("");
    setCoupon("");
  };

  if (items.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

          .cp-empty-page {
            min-height: 70vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 16px; text-align: center;
            padding: 60px 24px;
            font-family: 'Sora', sans-serif;
          }

          .cp-empty-icon {
            width: 80px; height: 80px;
            background: #f8fafc; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: #cbd5e1; margin-bottom: 8px;
          }

          .cp-empty-title {
            font-family: 'Playfair Display', serif;
            font-size: 28px; font-weight: 700;
            color: #0f172a; letter-spacing: -0.02em;
          }

          .cp-empty-sub { font-size: 15px; color: #94a3b8; font-weight: 300; }

          .cp-empty-btn {
            margin-top: 8px;
            display: inline-flex; align-items: center; gap: 8px;
            height: 48px; padding: 0 32px;
            background: #0f172a; color: #fff;
            font-family: 'Sora', sans-serif;
            font-size: 14px; font-weight: 600;
            border-radius: 12px; text-decoration: none;
            transition: all 0.2s;
          }
          .cp-empty-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,23,42,0.2); }
        `}</style>

        <div className="cp-empty-page">
          <div className="cp-empty-icon">
            <ShoppingBag size={36} />
          </div>
          <h1 className="cp-empty-title">Your bag is empty</h1>
          <p className="cp-empty-sub">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link href="/products" className="cp-empty-btn">
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

        .cp-page { background: #fafaf9; min-height: 100vh; }

        /* Hero */
        .cp-hero {
          background: #0f172a; padding: 40px 48px;
          position: relative; overflow: hidden;
        }
        .cp-hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 0% 50%, rgba(14,165,233,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .cp-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .cp-hero-eyebrow {
          font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #0ea5e9; margin-bottom: 8px;
        }
        .cp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px); font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
        }

        /* Layout */
        .cp-layout {
          max-width: 1100px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px; align-items: start;
        }

        /* Items panel */
        .cp-panel {
          background: #fff; border-radius: 20px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }

        .cp-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid #f8fafc;
        }

        .cp-panel-title {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; color: #0f172a;
        }

        .cp-clear-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 500; color: #94a3b8;
          display: flex; align-items: center; gap: 4px;
          transition: color 0.2s; padding: 0;
        }
        .cp-clear-btn:hover { color: #ef4444; }

        /* Item row */
        .cp-item {
          display: grid;
          grid-template-columns: 88px 1fr;
          gap: 16px; padding: 20px 24px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .cp-item:last-child { border-bottom: none; }
        .cp-item:hover { background: #fafaf9; }

        .cp-item-img {
          width: 88px; height: 108px;
          border-radius: 12px; overflow: hidden;
          background: #f1f5f9; flex-shrink: 0;
        }
        .cp-item-img img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.3s;
        }
        .cp-item-img:hover img { transform: scale(1.04); }

        .cp-item-body { display: flex; flex-direction: column; gap: 8px; min-width: 0; }

        .cp-item-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }

        .cp-item-info { min-width: 0; }

        .cp-item-cat {
          font-family: 'Sora', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 3px;
        }

        .cp-item-name {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600; color: #0f172a;
          text-decoration: none; line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.2s;
        }
        .cp-item-name:hover { color: #0ea5e9; }

        .cp-item-remove {
          background: none; border: none; cursor: pointer;
          color: #e2e8f0; padding: 2px; transition: color 0.2s; flex-shrink: 0;
        }
        .cp-item-remove:hover { color: #ef4444; }

        .cp-item-bottom { display: flex; align-items: center; justify-content: space-between; }

        .cp-item-price {
          font-family: 'Sora', sans-serif;
          font-size: 16px; font-weight: 700; color: #0f172a;
        }

        .cp-item-unit {
          font-family: 'Sora', sans-serif;
          font-size: 11px; color: #94a3b8; margin-top: 2px;
        }

        /* Qty */
        .cp-qty {
          display: flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          overflow: hidden; background: #fff;
        }
        .cp-qty-btn {
          width: 32px; height: 32px;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #374151; transition: background 0.15s;
        }
        .cp-qty-btn:hover:not(:disabled) { background: #f8fafc; }
        .cp-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .cp-qty-val {
          width: 36px; text-align: center;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 700; color: #0f172a;
          border-left: 1.5px solid #e2e8f0;
          border-right: 1.5px solid #e2e8f0;
          line-height: 32px;
        }

        /* Summary card */
        .cp-summary {
          background: #fff; border-radius: 20px;
          border: 1px solid #f1f5f9;
          padding: 24px; position: sticky; top: 96px;
        }

        .cp-summary-title {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; color: #0f172a;
          margin-bottom: 20px;
        }

        .cp-summary-rows { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }

        .cp-summary-row {
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'Sora', sans-serif; font-size: 13px; color: #64748b;
        }
        .cp-summary-row span:last-child { font-weight: 600; color: #374151; }

        .cp-summary-discount { color: #16a34a !important; }

        .cp-summary-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

        .cp-summary-total {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 0 20px;
          font-family: 'Sora', sans-serif;
        }
        .cp-summary-total span:first-child { font-size: 15px; font-weight: 700; color: #0f172a; }
        .cp-total-amount {
          font-size: 24px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.03em;
        }

        /* Coupon */
        .cp-coupon { margin-bottom: 20px; }

        .cp-coupon-label {
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }

        .cp-coupon-form { display: flex; gap: 8px; }

        .cp-coupon-input {
          flex: 1; height: 38px;
          padding: 0 12px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-family: 'Sora', sans-serif; font-size: 12px;
          color: #0f172a; background: #f8fafc;
          outline: none; text-transform: uppercase;
          transition: all 0.2s;
        }
        .cp-coupon-input:focus { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }

        .cp-coupon-btn {
          height: 38px; padding: 0 16px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .cp-coupon-btn:hover { background: #1e293b; }

        .cp-coupon-err { font-family: 'Sora', sans-serif; font-size: 11px; color: #ef4444; margin-top: 6px; }

        .cp-coupon-applied {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px;
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 9px;
          font-family: 'Sora', sans-serif; font-size: 12px;
          font-weight: 600; color: #16a34a;
        }
        .cp-coupon-remove { background: none; border: none; cursor: pointer; color: #16a34a; padding: 0; line-height: 1; }

        /* Checkout btn */
        .cp-checkout-btn {
          width: 100%; height: 52px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 14px;
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .cp-checkout-btn:hover {
          background: #1e293b; transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(15,23,42,0.28);
        }

        .cp-continue {
          display: block; text-align: center; margin-top: 12px;
          font-family: 'Sora', sans-serif; font-size: 12px;
          font-weight: 500; color: #94a3b8; text-decoration: none;
          transition: color 0.2s;
        }
        .cp-continue:hover { color: #0ea5e9; }

        /* Trust */
        .cp-trust {
          margin-top: 20px; padding-top: 16px;
          border-top: 1px solid #f1f5f9;
          display: flex; flex-direction: column; gap: 8px;
        }
        .cp-trust-row {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Sora', sans-serif; font-size: 11px; color: #94a3b8;
        }

        @media (max-width: 768px) {
          .cp-layout { grid-template-columns: 1fr; padding: 20px 16px 60px; }
          .cp-hero { padding: 32px 20px; }
          .cp-summary { position: static; }
        }
      `}</style>

      <div className="cp-page">
        {/* Hero */}
        <div className="cp-hero">
          <div className="cp-hero-inner">
            <p className="cp-hero-eyebrow">Shopping Bag</p>
            <h1 className="cp-hero-title">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your bag
            </h1>
          </div>
        </div>

        <div className="cp-layout">
          {/* Items */}
          <div>
            <div className="cp-panel">
              <div className="cp-panel-header">
                <span className="cp-panel-title">Your Items</span>
                <button className="cp-clear-btn" onClick={clearCart}>
                  <Trash2 size={12} /> Clear all
                </button>
              </div>

              {items.map((item) => (
                <div key={item.id} className="cp-item">
                  <Link href={`/products/${item.product.slug}`}>
                    <div className="cp-item-img">
                      <img
                        src={item.product.images?.[0] ?? "/placeholder.jpg"}
                        alt={item.product.name}
                      />
                    </div>
                  </Link>

                  <div className="cp-item-body">
                    <div className="cp-item-top">
                      <div className="cp-item-info">
                        <p className="cp-item-cat">
                          {item.product.category.name}
                        </p>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="cp-item-name"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <button
                        className="cp-item-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="cp-item-bottom">
                      <div className="cp-qty">
                        <button
                          className="cp-qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cp-qty-val">{item.quantity}</span>
                        <button
                          className="cp-qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <p className="cp-item-price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="cp-item-unit">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="cp-summary">
            <p className="cp-summary-title">Order Summary</p>

            {/* Coupon */}
            <div className="cp-coupon">
              <p className="cp-coupon-label">
                <Tag size={11} /> Coupon code
              </p>
              {appliedCode ? (
                <div className="cp-coupon-applied">
                  <span>
                    ✓ {appliedCode} — -${discountAmt.toFixed(2)}
                  </span>
                  <button className="cp-coupon-remove" onClick={removeCoupon}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCoupon}>
                  <div className="cp-coupon-form">
                    <input
                      className="cp-coupon-input"
                      placeholder="Enter code"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setCouponError("");
                      }}
                    />
                    <button
                      type="submit"
                      className="cp-coupon-btn"
                      disabled={isApplyingCoupon}
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="cp-coupon-err">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Rows */}
            <div className="cp-summary-rows">
              <div className="cp-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="cp-summary-row">
                  <span>Discount ({appliedCode})</span>
                  <span className="cp-summary-discount">
                    −${discountAmt.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="cp-summary-row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free 🎉" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="cp-summary-divider" />

            <div className="cp-summary-total">
              <span>Total</span>
              <span className="cp-total-amount">${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="cp-checkout-btn">
              Proceed to checkout <ArrowRight size={16} />
            </Link>

            <Link href="/products" className="cp-continue">
              ← Continue shopping
            </Link>

            {/* Trust */}
            <div className="cp-trust">
              <div className="cp-trust-row">🔒 Secure SSL checkout</div>
              <div className="cp-trust-row">🔄 Free 30-day returns</div>
              <div className="cp-trust-row">🚚 Free shipping over $100</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
