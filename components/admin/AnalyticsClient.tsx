"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

type DailyRevenue = { date: string; revenue: number };
type MonthlyRevenue = { month: string; revenue: number };
type CategoryData = { name: string; count: number };
type TopProduct = {
  productId: string;
  _sum: { quantity?: number | null };
  product: any;
};

type Data = {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  usersThisMonth: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  dailyRevenue: DailyRevenue[];
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  categoryData: CategoryData[];
  ordersByStatus: { status: string; _count: { id: number } }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#d97706",
  PAID: "#0ea5e9",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatGrowth(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

.an-root { font-family: 'Sora', sans-serif; color: #fff; }
.an-header { margin-bottom: 28px; }
.an-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #0ea5e9; margin-bottom: 4px; }
.an-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.an-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }

/* Stats */
.an-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.an-stat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; transition: all 0.2s; animation: anFade 0.4s ease both; }
.an-stat:hover { background: rgba(255,255,255,0.06); }
.an-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.an-stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.an-stat-growth { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }
.an-stat-growth-up   { color: #10b981; background: rgba(16,185,129,0.12); }
.an-stat-growth-down { color: #ef4444; background: rgba(239,68,68,0.12); }
.an-stat-value { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.03em; line-height: 1; }
.an-stat-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; }
.an-stat-sub   { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 2px; }

/* Grid */
.an-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.an-grid-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }

/* Panel */
.an-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.an-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.an-panel-title { font-size: 13px; font-weight: 700; color: #fff; }
.an-panel-sub   { font-size: 11px; color: rgba(255,255,255,0.3); }
.an-panel-link  { font-size: 11px; font-weight: 600; color: #0ea5e9; text-decoration: none; display: flex; align-items: center; gap: 4px; transition: gap 0.2s; }
.an-panel-link:hover { gap: 8px; }

/* Bar chart */
.an-chart { padding: 20px; }
.an-bars { display: flex; align-items: flex-end; gap: 4px; height: 140px; }
.an-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.an-bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.6s ease, opacity 0.2s; cursor: pointer; min-height: 2px; }
.an-bar:hover { opacity: 0.8; }
.an-bar-label { font-size: 9px; color: rgba(255,255,255,0.25); text-align: center; white-space: nowrap; overflow: hidden; }

/* Monthly chart */
.an-monthly-bars { display: flex; align-items: flex-end; gap: 6px; height: 120px; }
.an-monthly-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.an-monthly-bar { width: 100%; border-radius: 4px 4px 0 0; background: linear-gradient(to top, #0ea5e9, #38bdf8); min-height: 2px; transition: height 0.6s ease; }
.an-monthly-label { font-size: 9px; color: rgba(255,255,255,0.3); text-align: center; }

/* Top products */
.an-product-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
.an-product-item:last-child { border-bottom: none; }
.an-product-item:hover { background: rgba(255,255,255,0.02); }
.an-product-rank { width: 20px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.2); text-align: center; flex-shrink: 0; }
.an-product-img  { width: 36px; height: 44px; border-radius: 7px; overflow: hidden; background: rgba(255,255,255,0.06); flex-shrink: 0; }
.an-product-img img { width: 100%; height: 100%; object-fit: cover; }
.an-product-name { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.3; }
.an-product-cat  { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 1px; }
.an-product-qty  { margin-left: auto; font-size: 12px; font-weight: 700; color: #0ea5e9; flex-shrink: 0; }
.an-product-qty-label { font-size: 10px; color: rgba(255,255,255,0.3); text-align: right; }

/* Category bars */
.an-cat-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.an-cat-row  { display: flex; flex-direction: column; gap: 5px; }
.an-cat-info { display: flex; justify-content: space-between; }
.an-cat-name  { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); }
.an-cat-count { font-size: 11px; color: rgba(255,255,255,0.4); }
.an-cat-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.an-cat-fill  { height: 100%; border-radius: 3px; background: linear-gradient(to right, #0ea5e9, #38bdf8); transition: width 0.6s ease; }

/* Status donut */
.an-status-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.an-status-row  { display: flex; align-items: center; gap: 10px; }
.an-status-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.an-status-name { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.6); flex: 1; }
.an-status-count { font-size: 12px; font-weight: 700; color: #fff; }
.an-status-bar-wrap { flex: 2; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.an-status-bar { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

/* Summary row */
.an-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
.an-summary-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 18px; }
.an-summary-label { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
.an-summary-value { font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.an-summary-sub   { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 3px; }

@keyframes anFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) {
  .an-stats { grid-template-columns: repeat(2, 1fr); }
  .an-grid-2, .an-grid-3 { grid-template-columns: 1fr; }
  .an-summary { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .an-stats { grid-template-columns: 1fr 1fr; }
  .an-summary { grid-template-columns: 1fr; }
}
`;

export function AnalyticsClient({ data }: { data: Data }) {
  const {
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    revenueThisMonth,
    ordersThisMonth,
    usersThisMonth,
    revenueGrowth,
    ordersGrowth,
    usersGrowth,
    dailyRevenue,
    monthlyRevenue,
    topProducts,
    categoryData,
    ordersByStatus,
  } = data;

  const maxDaily = Math.max(...dailyRevenue.map((d) => d.revenue), 1);
  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const maxCat = Math.max(...categoryData.map((c) => c.count), 1);
  const maxStatus = Math.max(...ordersByStatus.map((s) => s._count.id), 1);

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      sub: `${formatCurrency(revenueThisMonth)} this month`,
      growth: revenueGrowth,
      icon: DollarSign,
      iconBg: "rgba(16,185,129,0.15)",
      iconColor: "#10b981",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      sub: `${ordersThisMonth} this month`,
      growth: ordersGrowth,
      icon: ShoppingBag,
      iconBg: "rgba(14,165,233,0.15)",
      iconColor: "#0ea5e9",
    },
    {
      label: "Customers",
      value: totalUsers.toLocaleString(),
      sub: `${usersThisMonth} new this month`,
      growth: usersGrowth,
      icon: Users,
      iconBg: "rgba(139,92,246,0.15)",
      iconColor: "#8b5cf6",
    },
    {
      label: "Products",
      value: totalProducts.toLocaleString(),
      sub: "Total in catalog",
      growth: null,
      icon: Package,
      iconBg: "rgba(245,158,11,0.15)",
      iconColor: "#f59e0b",
    },
  ];

  // Average order value
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="an-root">
        <div className="an-header">
          <p className="an-eyebrow">Analytics</p>
          <h1 className="an-title">Store Performance</h1>
          <p className="an-subtitle">Last 30 days vs previous 30 days</p>
        </div>

        {/* Stats */}
        <div className="an-stats">
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className="an-stat"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="an-stat-top">
                <div className="an-stat-icon" style={{ background: s.iconBg }}>
                  <s.icon size={17} color={s.iconColor} />
                </div>
                {s.growth !== null && (
                  <div
                    className={`an-stat-growth ${s.growth >= 0 ? "an-stat-growth-up" : "an-stat-growth-down"}`}
                  >
                    {s.growth >= 0 ? (
                      <TrendingUp size={10} />
                    ) : (
                      <TrendingDown size={10} />
                    )}
                    {formatGrowth(s.growth)}
                  </div>
                )}
              </div>
              <p className="an-stat-value">{s.value}</p>
              <p className="an-stat-label">{s.label}</p>
              <p className="an-stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Summary row */}
        <div className="an-summary">
          <div className="an-summary-card">
            <p className="an-summary-label">Avg. Order Value</p>
            <p className="an-summary-value">{formatCurrency(aov)}</p>
            <p className="an-summary-sub">per order</p>
          </div>
          <div className="an-summary-card">
            <p className="an-summary-label">Revenue / Customer</p>
            <p className="an-summary-value">
              {totalUsers > 0
                ? formatCurrency(totalRevenue / totalUsers)
                : "$0"}
            </p>
            <p className="an-summary-sub">lifetime value</p>
          </div>
          <div className="an-summary-card">
            <p className="an-summary-label">Orders / Customer</p>
            <p className="an-summary-value">
              {totalUsers > 0 ? (totalOrders / totalUsers).toFixed(1) : "0"}
            </p>
            <p className="an-summary-sub">avg orders per user</p>
          </div>
        </div>

        {/* Daily revenue chart */}
        <div className="an-panel" style={{ marginBottom: 20 }}>
          <div className="an-panel-header">
            <div>
              <p className="an-panel-title">Daily Revenue</p>
              <p className="an-panel-sub">Last 30 days</p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>
              {formatCurrency(revenueThisMonth)}
            </span>
          </div>
          <div className="an-chart">
            <div className="an-bars">
              {dailyRevenue.map((d, i) => (
                <div
                  key={d.date}
                  className="an-bar-wrap"
                  title={`${d.date}: ${formatCurrency(d.revenue)}`}
                >
                  <div
                    className="an-bar"
                    style={{
                      height: `${Math.max((d.revenue / maxDaily) * 100, d.revenue > 0 ? 4 : 1)}%`,
                      background:
                        d.revenue > 0
                          ? `linear-gradient(to top, #0ea5e9, #38bdf8)`
                          : "rgba(255,255,255,0.06)",
                    }}
                  />
                  {i % 5 === 0 && (
                    <span className="an-bar-label">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly chart + status */}
        <div className="an-grid-3">
          <div className="an-panel">
            <div className="an-panel-header">
              <div>
                <p className="an-panel-title">Monthly Revenue</p>
                <p className="an-panel-sub">This year</p>
              </div>
            </div>
            <div className="an-chart">
              <div className="an-monthly-bars">
                {monthlyRevenue.map((m) => (
                  <div
                    key={m.month}
                    className="an-monthly-bar-wrap"
                    title={`${m.month}: ${formatCurrency(m.revenue)}`}
                  >
                    <div
                      className="an-monthly-bar"
                      style={{
                        height: `${Math.max((m.revenue / maxMonthly) * 100, m.revenue > 0 ? 4 : 1)}%`,
                      }}
                    />
                    <span className="an-monthly-label">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="an-panel">
            <div className="an-panel-header">
              <p className="an-panel-title">Orders by Status</p>
            </div>
            <div className="an-status-list">
              {ordersByStatus.map((s) => (
                <div key={s.status} className="an-status-row">
                  <div
                    className="an-status-dot"
                    style={{ background: STATUS_COLORS[s.status] ?? "#64748b" }}
                  />
                  <span className="an-status-name">
                    {s.status.charAt(0) + s.status.slice(1).toLowerCase()}
                  </span>
                  <div className="an-status-bar-wrap">
                    <div
                      className="an-status-bar"
                      style={{
                        width: `${(s._count.id / maxStatus) * 100}%`,
                        background: STATUS_COLORS[s.status] ?? "#64748b",
                      }}
                    />
                  </div>
                  <span className="an-status-count">{s._count.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products + categories */}
        <div className="an-grid-2">
          <div className="an-panel">
            <div className="an-panel-header">
              <p className="an-panel-title">Top Products by Sales</p>
              <Link href="/admin/products" className="an-panel-link">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            {topProducts.slice(0, 6).map((tp, i) => (
              <div key={tp.productId} className="an-product-item">
                <span className="an-product-rank">{i + 1}</span>
                <div className="an-product-img">
                  <img
                    src={tp.product?.images?.[0] ?? "/placeholder.jpg"}
                    alt={tp.product?.name}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="an-product-name">{tp.product?.name}</p>
                  <p className="an-product-cat">{tp.product?.category?.name}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="an-product-qty">{tp._sum.quantity ?? 0}</p>
                  <p className="an-product-qty-label">sold</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="an-panel">
              <div className="an-panel-header">
                <p className="an-panel-title">Sales by Category</p>
              </div>
              <div className="an-cat-list">
                {categoryData.length === 0 ? (
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                    No data yet
                  </p>
                ) : (
                  categoryData.map((c) => (
                    <div key={c.name} className="an-cat-row">
                      <div className="an-cat-info">
                        <span className="an-cat-name">{c.name}</span>
                        <span className="an-cat-count">{c.count} sold</span>
                      </div>
                      <div className="an-cat-track">
                        <div
                          className="an-cat-fill"
                          style={{ width: `${(c.count / maxCat) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="an-panel">
              <div className="an-panel-header">
                <p className="an-panel-title">Quick Stats</p>
              </div>
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  {
                    label: "Conversion rate",
                    value: "—",
                    sub: "visitors → orders",
                  },
                  {
                    label: "Avg. order value",
                    value: formatCurrency(aov),
                    sub: "per transaction",
                  },
                  {
                    label: "Total products sold",
                    value: topProducts
                      .reduce((s, p) => s + (p._sum.quantity ?? 0), 0)
                      .toLocaleString(),
                    sub: "all time",
                  },
                ].map((q) => (
                  <div
                    key={q.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {q.label}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.25)",
                          marginTop: 2,
                        }}
                      >
                        {q.sub}
                      </p>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                      {q.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
