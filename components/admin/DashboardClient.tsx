"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "#d97706",
    bg: "rgba(217,119,6,0.12)",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.12)",
    icon: CheckCircle,
  },
  SHIPPED: {
    label: "Shipped",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    icon: XCircle,
  },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

type LowStockProduct = {
  id: string;
  name: string;
  slug: string;
  stock: number;
  images: string[];
  category: { name: string };
};

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  topProducts: any[];
  ordersByStatus: any[];
  revenueByDay: any[];
  lowStockProducts: LowStockProduct[];
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

.dc-root { font-family: 'Sora', sans-serif; color: #fff; }

.dc-header { margin-bottom: 28px; }
.dc-header-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #0ea5e9; margin-bottom: 4px; }
.dc-header-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }

.dc-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }

.dc-stat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; transition: all 0.2s; animation: dcFadeUp 0.4s ease both; }
.dc-stat:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
.dc-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.dc-stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.dc-stat-trend { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; color: #10b981; }
.dc-stat-value { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.03em; line-height: 1; }
.dc-stat-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; font-weight: 400; }

/* Low stock alert */
.dc-alert {
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 16px; overflow: hidden; margin-bottom: 20px;
  animation: dcFadeUp 0.4s ease both;
}
.dc-alert-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid rgba(239,68,68,0.15);
}
.dc-alert-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700; color: #f87171;
}
.dc-alert-badge {
  background: rgba(239,68,68,0.2); color: #f87171;
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 100px;
}
.dc-alert-link { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #f87171; text-decoration: none; opacity: 0.7; transition: opacity 0.2s; }
.dc-alert-link:hover { opacity: 1; }
.dc-alert-list { display: flex; flex-direction: column; }
.dc-alert-item { display: flex; align-items: center; gap: 12px; padding: 11px 20px; border-bottom: 1px solid rgba(239,68,68,0.08); transition: background 0.15s; }
.dc-alert-item:last-child { border-bottom: none; }
.dc-alert-item:hover { background: rgba(239,68,68,0.04); }
.dc-alert-img { width: 36px; height: 44px; border-radius: 7px; overflow: hidden; background: rgba(255,255,255,0.06); flex-shrink: 0; }
.dc-alert-img img { width: 100%; height: 100%; object-fit: cover; }
.dc-alert-name { font-size: 12px; font-weight: 600; color: #fff; }
.dc-alert-cat  { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 1px; }
.dc-alert-stock-out  { margin-left: auto; font-size: 11px; font-weight: 700; color: #ef4444; background: rgba(239,68,68,0.15); padding: 2px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0; }
.dc-alert-stock-low  { margin-left: auto; font-size: 11px; font-weight: 700; color: #f59e0b; background: rgba(245,158,11,0.15); padding: 2px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0; }

.dc-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; margin-bottom: 20px; }
.dc-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.dc-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.dc-panel-title { font-size: 13px; font-weight: 700; color: #fff; }
.dc-panel-link { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #0ea5e9; text-decoration: none; transition: gap 0.2s; }
.dc-panel-link:hover { gap: 8px; }

.dc-table { width: 100%; border-collapse: collapse; }
.dc-table th { padding: 10px 16px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); }
.dc-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; color: rgba(255,255,255,0.75); }
.dc-table tr:last-child td { border-bottom: none; }
.dc-table tr:hover td { background: rgba(255,255,255,0.02); }
.dc-order-id { font-weight: 700; color: #fff; font-size: 12px; }
.dc-order-user { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
.dc-status { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.dc-amount { font-weight: 700; color: #fff; }

.dc-product-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
.dc-product-item:last-child { border-bottom: none; }
.dc-product-item:hover { background: rgba(255,255,255,0.02); }
.dc-product-rank { width: 20px; text-align: center; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.2); flex-shrink: 0; }
.dc-product-img { width: 40px; height: 48px; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,0.06); flex-shrink: 0; }
.dc-product-img img { width: 100%; height: 100%; object-fit: cover; }
.dc-product-name { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.3; }
.dc-product-price { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.dc-product-sold { margin-left: auto; text-align: right; flex-shrink: 0; font-size: 12px; font-weight: 700; color: #0ea5e9; }
.dc-product-sold-label { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; }

.dc-status-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.dc-status-row { display: flex; align-items: center; gap: 10px; }
.dc-status-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.dc-status-bar { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.dc-status-count { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6); min-width: 28px; text-align: right; }

@keyframes dcFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) { .dc-stats { grid-template-columns: repeat(2, 1fr); } .dc-grid { grid-template-columns: 1fr; } }
@media (max-width: 640px)  { .dc-stats { grid-template-columns: 1fr 1fr; } }
`;

export function DashboardClient({ stats }: { stats: Stats }) {
  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    topProducts,
    ordersByStatus,
    lowStockProducts,
  } = stats;

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      iconBg: "rgba(16,185,129,0.15)",
      iconColor: "#10b981",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      iconBg: "rgba(14,165,233,0.15)",
      iconColor: "#0ea5e9",
    },
    {
      label: "Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      iconBg: "rgba(139,92,246,0.15)",
      iconColor: "#8b5cf6",
    },
    {
      label: "Customers",
      value: totalUsers.toLocaleString(),
      icon: Users,
      iconBg: "rgba(245,158,11,0.15)",
      iconColor: "#f59e0b",
    },
  ];

  const maxOrders = Math.max(...ordersByStatus.map((s) => s._count.id), 1);

  return (
    <>
      <style>{CSS}</style>
      <div className="dc-root">
        <div className="dc-header">
          <p className="dc-header-eyebrow">Dashboard</p>
          <h1 className="dc-header-title">Store Overview</h1>
        </div>

        {/* Stats */}
        <div className="dc-stats">
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className="dc-stat"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="dc-stat-top">
                <div className="dc-stat-icon" style={{ background: s.iconBg }}>
                  <s.icon size={17} color={s.iconColor} />
                </div>
                <div className="dc-stat-trend">
                  <TrendingUp size={11} /> Live
                </div>
              </div>
              <p className="dc-stat-value">{s.value}</p>
              <p className="dc-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Low stock alert */}
        {lowStockProducts.length > 0 && (
          <div className="dc-alert">
            <div className="dc-alert-header">
              <div className="dc-alert-title">
                <AlertTriangle size={15} />
                Low Stock Alert
                <span className="dc-alert-badge">
                  {lowStockProducts.length} products
                </span>
              </div>
              <Link href="/admin/products" className="dc-alert-link">
                Manage stock <ArrowRight size={11} />
              </Link>
            </div>
            <div className="dc-alert-list">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href="/admin/products"
                  style={{ textDecoration: "none" }}
                >
                  <div className="dc-alert-item">
                    <div className="dc-alert-img">
                      <img
                        src={p.images?.[0] ?? "/placeholder.jpg"}
                        alt={p.name}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="dc-alert-name">{p.name}</p>
                      <p className="dc-alert-cat">{p.category.name}</p>
                    </div>
                    <span
                      className={
                        p.stock === 0
                          ? "dc-alert-stock-out"
                          : "dc-alert-stock-low"
                      }
                    >
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="dc-grid">
          {/* Recent orders */}
          <div className="dc-panel">
            <div className="dc-panel-header">
              <span className="dc-panel-title">Recent Orders</span>
              <Link href="/admin/orders" className="dc-panel-link">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <table className="dc-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const status =
                    STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <p className="dc-order-id">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="dc-order-user">
                            {order.user?.name ?? order.user?.email ?? "Guest"}
                          </p>
                        </Link>
                      </td>
                      <td>
                        <span
                          className="dc-status"
                          style={{ color: status.color, background: status.bg }}
                        >
                          <StatusIcon size={10} /> {status.label}
                        </span>
                      </td>
                      <td
                        style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                      >
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="dc-amount">
                        ${Number(order.total).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="dc-panel">
              <div className="dc-panel-header">
                <span className="dc-panel-title">Orders by Status</span>
              </div>
              <div className="dc-status-list">
                {ordersByStatus.map((s) => {
                  const cfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.PENDING;
                  return (
                    <div key={s.status} className="dc-status-row">
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: cfg.color,
                          minWidth: 70,
                        }}
                      >
                        {cfg.label}
                      </span>
                      <div className="dc-status-bar-wrap">
                        <div
                          className="dc-status-bar"
                          style={{
                            width: `${(s._count.id / maxOrders) * 100}%`,
                            background: cfg.color,
                          }}
                        />
                      </div>
                      <span className="dc-status-count">{s._count.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dc-panel">
              <div className="dc-panel-header">
                <span className="dc-panel-title">Top Products</span>
                <Link href="/admin/products" className="dc-panel-link">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {topProducts.map((tp, i) => (
                <div key={tp.productId} className="dc-product-item">
                  <span className="dc-product-rank">{i + 1}</span>
                  <div className="dc-product-img">
                    <img
                      src={tp.product?.images?.[0] ?? "/placeholder.jpg"}
                      alt={tp.product?.name}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="dc-product-name">{tp.product?.name}</p>
                    <p className="dc-product-price">
                      ${tp.product?.price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="dc-product-sold">
                    {tp._sum.quantity}
                    <p className="dc-product-sold-label">sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
