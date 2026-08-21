"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; images: string[]; slug: string };
};

type Order = {
  id: string;
  total?: number | null;
  status: string;
  createdAt: Date;
  items: OrderItem[];
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  PENDING: { label: "Pending", color: "#d97706", bg: "#fffbeb", icon: Clock },
  PROCESSING: {
    label: "Processing",
    color: "#0284c7",
    bg: "#f0f9ff",
    icon: Package,
  },
  PAID: { label: "Paid", color: "#0284c7", bg: "#f0f9ff", icon: CheckCircle },
  SHIPPED: { label: "Shipped", color: "#7c3aed", bg: "#f5f3ff", icon: Truck },
  DELIVERED: {
    label: "Delivered",
    color: "#16a34a",
    bg: "#f0fdf4",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#dc2626",
    bg: "#fef2f2",
    icon: XCircle,
  },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getOrderTotal(order: Order) {
  if (order.total) return Number(order.total);
  return order.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
}

export function OrdersList({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/account/orders");
        if (!res.ok) return;
        const data = await res.json();
        setOrders(data.orders);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
          .ol-empty {
            background: #fff; border: 1px solid #f1f5f9;
            border-radius: 20px; padding: 64px 24px;
            text-align: center; font-family: 'Sora', sans-serif;
          }
          .ol-empty-icon {
            width: 64px; height: 64px; border-radius: 50%;
            background: #f8fafc; margin: 0 auto 16px;
            display: flex; align-items: center; justify-content: center;
            color: #cbd5e1;
          }
          .ol-empty-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .ol-empty-sub   { font-size: 14px; color: #94a3b8; font-weight: 300; margin-bottom: 24px; }
          .ol-empty-btn {
            display: inline-flex; align-items: center; gap: 8px;
            height: 44px; padding: 0 28px;
            background: #0f172a; color: #fff;
            font-family: 'Sora', sans-serif;
            font-size: 13px; font-weight: 600;
            border-radius: 12px; text-decoration: none;
            transition: all 0.2s;
          }
          .ol-empty-btn:hover { background: #1e293b; }
        `}</style>
        <div className="ol-empty">
          <div className="ol-empty-icon">
            <ShoppingBag size={28} />
          </div>
          <h2 className="ol-empty-title">No orders yet</h2>
          <p className="ol-empty-sub">
            When you place an order it will appear here.
          </p>
          <Link href="/products" className="ol-empty-btn">
            Start shopping →
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .ol-root { display: flex; flex-direction: column; gap: 16px; font-family: 'Sora', sans-serif; }

        .ol-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .ol-header-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .ol-header-count { font-size: 12px; color: #94a3b8; }

        .ol-live {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #10b981; font-weight: 500;
        }
        .ol-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10b981;
          animation: olPulse 2s ease infinite;
        }

        .ol-card {
          background: #fff; border: 1px solid #f1f5f9;
          border-radius: 20px; overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .ol-card:hover { box-shadow: 0 4px 20px rgba(15,23,42,0.06); }

        .ol-card-header {
          padding: 16px 20px;
          display: flex; align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f8fafc;
          flex-wrap: wrap; gap: 10px;
        }

        .ol-card-left { display: flex; flex-direction: column; gap: 3px; }
        .ol-order-id { font-size: 12px; font-weight: 700; color: #0f172a; letter-spacing: 0.02em; }
        .ol-order-date { font-size: 11px; color: #94a3b8; }

        .ol-status {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 600;
          transition: all 0.3s ease;
        }

        .ol-items {
          padding: 16px 20px;
          display: flex; gap: 10px; flex-wrap: wrap;
          border-bottom: 1px solid #f8fafc;
        }

        .ol-item-img {
          width: 52px; height: 64px;
          border-radius: 8px; overflow: hidden;
          background: #f1f5f9; flex-shrink: 0;
          position: relative;
        }
        .ol-item-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ol-item-qty {
          position: absolute; bottom: 3px; right: 3px;
          background: rgba(15,23,42,0.75);
          color: #fff; font-size: 9px; font-weight: 700;
          padding: 1px 5px; border-radius: 4px;
        }
        .ol-item-more {
          width: 52px; height: 64px; border-radius: 8px;
          background: #f8fafc; border: 1px dashed #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #94a3b8;
        }

        .ol-card-footer {
          padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ol-total-label { font-size: 12px; color: #64748b; }
        .ol-total-amount { font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
        .ol-detail-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 600; color: #0ea5e9;
          text-decoration: none; transition: gap 0.2s;
        }
        .ol-detail-link:hover { gap: 8px; }

        @keyframes olFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes olPulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .ol-card { animation: olFadeUp 0.35s ease both; }
      `}</style>

      <div className="ol-root">
        <div className="ol-header">
          <p className="ol-header-title">Order History</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="ol-live">
              <div className="ol-live-dot" /> Live updates
            </div>
            <p className="ol-header-count">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {orders.map((order, i) => {
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
          const StatusIcon = status.icon;
          const total = getOrderTotal(order);
          const preview = order.items.slice(0, 4);
          const extra = order.items.length - 4;

          return (
            <div
              key={order.id}
              className="ol-card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="ol-card-header">
                <div className="ol-card-left">
                  <span className="ol-order-id">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="ol-order-date">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <span
                  className="ol-status"
                  style={{ color: status.color, background: status.bg }}
                >
                  <StatusIcon size={11} /> {status.label}
                </span>
              </div>

              <div className="ol-items">
                {preview.map((item) => (
                  <Link key={item.id} href={`/products/${item.product.slug}`}>
                    <div className="ol-item-img">
                      <img
                        src={item.product.images?.[0] ?? "/placeholder.jpg"}
                        alt={item.product.name}
                      />
                      {item.quantity > 1 && (
                        <span className="ol-item-qty">×{item.quantity}</span>
                      )}
                    </div>
                  </Link>
                ))}
                {extra > 0 && <div className="ol-item-more">+{extra}</div>}
              </div>

              <div className="ol-card-footer">
                <div>
                  <p className="ol-total-label">Order total</p>
                  <p className="ol-total-amount">${total.toFixed(2)}</p>
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="ol-detail-link"
                >
                  View details <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
