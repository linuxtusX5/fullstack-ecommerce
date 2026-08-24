"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  category: { name: string };
};

type WishlistItem = {
  id: string;
  productId: string;
  createdAt: Date;
  product: Product;
};

export function WishlistGrid({
  items: initialItems,
}: {
  items: WishlistItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const remove = async (wishlistId: string) => {
    setLoading(wishlistId);
    try {
      await fetch(`/api/account/wishlist/${wishlistId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== wishlistId));
    } finally {
      setLoading(null);
    }
  };

  const moveToCart = async (item: WishlistItem) => {
    addItem(item.product);
    openCart();
    await remove(item.id);
  };

  if (items.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
          .wg-empty {
            background: #fff; border: 1px solid #f1f5f9;
            border-radius: 20px; padding: 64px 24px;
            text-align: center; font-family: 'Sora', sans-serif;
          }
          .wg-empty-icon {
            width: 64px; height: 64px; border-radius: 50%;
            background: #fef2f2; margin: 0 auto 16px;
            display: flex; align-items: center; justify-content: center;
            color: #fca5a5;
          }
          .wg-empty-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .wg-empty-sub   { font-size: 14px; color: #94a3b8; font-weight: 300; margin-bottom: 24px; }
          .wg-empty-btn {
            display: inline-flex; align-items: center; gap: 8px;
            height: 44px; padding: 0 28px;
            background: #0f172a; color: #fff;
            font-family: 'Sora', sans-serif;
            font-size: 13px; font-weight: 600;
            border-radius: 12px; text-decoration: none;
            transition: all 0.2s;
          }
          .wg-empty-btn:hover { background: #1e293b; }
        `}</style>
        <div className="wg-empty">
          <div className="wg-empty-icon">
            <Heart size={28} />
          </div>
          <h2 className="wg-empty-title">Your wishlist is empty</h2>
          <p className="wg-empty-sub">
            Save items you love and come back to them anytime.
          </p>
          <Link href="/products" className="wg-empty-btn">
            Browse products <ArrowRight size={16} />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .wg-root { font-family: 'Sora', sans-serif; }

        .wg-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .wg-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .wg-count { font-size: 12px; color: #94a3b8; }

        .wg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        /* Card */
        .wg-card {
          background: #fff; border: 1px solid #f1f5f9;
          border-radius: 16px; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          animation: wgFadeUp 0.3s ease both;
        }
        .wg-card:hover {
          box-shadow: 0 8px 28px rgba(15,23,42,0.08);
          transform: translateY(-2px);
        }

        .wg-img {
          position: relative; width: 100%; padding-top: 120%;
          background: #f8fafc; overflow: hidden;
        }
        .wg-img img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .wg-card:hover .wg-img img { transform: scale(1.04); }

        .wg-img-actions {
          position: absolute; top: 8px; right: 8px;
          display: flex; flex-direction: column; gap: 6px;
          opacity: 0; transform: translateX(8px);
          transition: all 0.2s;
        }
        .wg-card:hover .wg-img-actions { opacity: 1; transform: translateX(0); }

        .wg-icon-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: #fff; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(15,23,42,0.12);
          transition: all 0.15s;
        }
        .wg-icon-btn:hover { transform: scale(1.1); }
        .wg-icon-btn-danger:hover { background: #fef2f2; color: #ef4444; }

        .wg-out-of-stock {
          position: absolute; bottom: 8px; left: 8px;
          background: rgba(15,23,42,0.75); color: #fff;
          font-size: 10px; font-weight: 600;
          padding: 3px 8px; border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .wg-body { padding: 12px; }

        .wg-cat {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 3px;
        }

        .wg-name {
          font-size: 13px; font-weight: 600; color: #0f172a;
          text-decoration: none; line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.2s;
        }
        .wg-name:hover { color: #0ea5e9; }

        .wg-price {
          font-size: 15px; font-weight: 700; color: #0f172a;
          margin-top: 6px;
        }

        .wg-add-btn {
          width: 100%; height: 36px; margin-top: 10px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .wg-add-btn:hover:not(:disabled) { background: #1e293b; }
        .wg-add-btn:disabled {
          background: #f1f5f9; color: #94a3b8; cursor: not-allowed;
        }

        @keyframes wgFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="wg-root">
        <div className="wg-header">
          <p className="wg-title">Saved Items</p>
          <p className="wg-count">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="wg-grid">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="wg-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Image */}
              <div className="wg-img">
                <img
                  src={item.product.images?.[0] ?? "/placeholder.jpg"}
                  alt={item.product.name}
                />

                {/* Hover actions */}
                <div className="wg-img-actions">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="wg-icon-btn"
                    title="View product"
                  >
                    <ExternalLink size={13} color="#374151" />
                  </Link>
                  <button
                    className="wg-icon-btn wg-icon-btn-danger"
                    onClick={() => remove(item.id)}
                    disabled={loading === item.id}
                    title="Remove"
                  >
                    <Trash2 size={13} color="#374151" />
                  </button>
                </div>

                {item.product.stock === 0 && (
                  <span className="wg-out-of-stock">Out of stock</span>
                )}
              </div>

              {/* Body */}
              <div className="wg-body">
                <p className="wg-cat">{item.product.category.name}</p>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="wg-name"
                >
                  {item.product.name}
                </Link>
                <p className="wg-price">${item.product.price.toFixed(2)}</p>

                <button
                  className="wg-add-btn"
                  onClick={() => moveToCart(item)}
                  disabled={item.product.stock === 0}
                >
                  <ShoppingBag size={13} />
                  {item.product.stock === 0 ? "Out of stock" : "Move to cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
