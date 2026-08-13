"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending", color: "#d97706", bg: "rgba(217,119,6,0.12)" },
  PAID: { label: "Paid", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
  SHIPPED: { label: "Shipped", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  DELIVERED: {
    label: "Delivered",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  paymentId?: string | null;
  user: { name?: string | null; email: string } | null;
  items: { product: { name: string } }[];
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
.aoc-root { font-family: 'Sora', sans-serif; color: #fff; }
.aoc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.aoc-title { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.aoc-count { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.aoc-filters { display: flex; gap: 8px; flex-wrap: wrap; }
.aoc-filter {
  height: 32px; padding: 0 14px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: none; cursor: pointer;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
  color: rgba(255,255,255,0.45); text-decoration: none;
  display: flex; align-items: center; transition: all 0.15s;
}
.aoc-filter:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }
.aoc-filter-active { border-color: #0ea5e9 !important; color: #38bdf8 !important; background: rgba(14,165,233,0.08) !important; }
.aoc-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.aoc-table { width: 100%; border-collapse: collapse; }
.aoc-table th {
  padding: 11px 16px; text-align: left;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap;
}
.aoc-table td { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; vertical-align: middle; }
.aoc-table tr:last-child td { border-bottom: none; }
.aoc-table tr:hover td { background: rgba(255,255,255,0.02); }
.aoc-id { font-weight: 700; color: #fff; font-size: 12px; }
.aoc-user { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); }
.aoc-email { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
.aoc-items { font-size: 11px; color: rgba(255,255,255,0.4); }
.aoc-amount { font-weight: 700; color: #fff; }
.aoc-date { font-size: 12px; color: rgba(255,255,255,0.4); white-space: nowrap; }
.aoc-status { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.aoc-select {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; color: #fff; padding: 5px 10px;
  font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
  cursor: pointer; outline: none; transition: all 0.15s;
}
.aoc-select:hover { border-color: rgba(255,255,255,0.2); }
.aoc-select option { background: #1e293b; color: #fff; }
.aoc-pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.06); }
.aoc-page-info { font-size: 12px; color: rgba(255,255,255,0.4); }
.aoc-page-btns { display: flex; gap: 6px; }
.aoc-page-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1); background: none;
  cursor: pointer; color: rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.aoc-page-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.2); color: #fff; }
.aoc-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.aoc-empty { text-align: center; padding: 64px 24px; color: rgba(255,255,255,0.3); font-size: 14px; }
`;

export function AdminOrdersClient({
  orders: initialOrders,
  total,
  page,
  pages,
  currentStatus,
}: {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
  currentStatus?: string;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    } finally {
      setUpdating(null);
    }
  };

  const filterHref = (s?: string) =>
    s ? `/admin/orders?status=${s}` : "/admin/orders";

  return (
    <>
      <style>{CSS}</style>
      <div className="aoc-root">
        <div className="aoc-header">
          <div>
            <h1 className="aoc-title">Orders</h1>
            <p className="aoc-count">{total} total orders</p>
          </div>
          <div className="aoc-filters">
            <Link
              href="/admin/orders"
              className={`aoc-filter ${!currentStatus ? "aoc-filter-active" : ""}`}
            >
              All
            </Link>
            {STATUSES.map((s) => (
              <Link
                key={s}
                href={filterHref(s)}
                className={`aoc-filter ${currentStatus === s ? "aoc-filter-active" : ""}`}
              >
                {STATUS_CONFIG[s].label}
              </Link>
            ))}
          </div>
        </div>

        <div className="aoc-panel">
          {orders.length === 0 ? (
            <div className="aoc-empty">No orders found.</div>
          ) : (
            <table className="aoc-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const cfg =
                    STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                  return (
                    <tr key={order.id}>
                      <td>
                        <span className="aoc-id">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <p className="aoc-user">
                          {order.user?.name ?? "Guest"}
                        </p>
                        <p className="aoc-email">{order.user?.email}</p>
                      </td>
                      <td>
                        <p className="aoc-items">
                          {order.items
                            .slice(0, 2)
                            .map((i) => i.product.name)
                            .join(", ")}
                          {order.items.length > 2 &&
                            ` +${order.items.length - 2} more`}
                        </p>
                      </td>
                      <td className="aoc-amount">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="aoc-date">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <select
                          className="aoc-select"
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          style={{ color: cfg.color }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div className="aoc-pagination">
              <span className="aoc-page-info">
                Page {page} of {pages}
              </span>
              <div className="aoc-page-btns">
                <button
                  className="aoc-page-btn"
                  disabled={page <= 1}
                  onClick={() =>
                    router.push(
                      `/admin/orders?page=${page - 1}${currentStatus ? `&status=${currentStatus}` : ""}`,
                    )
                  }
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="aoc-page-btn"
                  disabled={page >= pages}
                  onClick={() =>
                    router.push(
                      `/admin/orders?page=${page + 1}${currentStatus ? `&status=${currentStatus}` : ""}`,
                    )
                  }
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
