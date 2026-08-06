"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  LogOut,
  ExternalLink,
  Settings,
  BarChart2,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        .as-root {
          width: 220px; flex-shrink: 0;
          background: #0d1425;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          font-family: 'Sora', sans-serif;
          position: sticky; top: 0; height: 100vh;
        }

        .as-logo {
          height: 56px; padding: 0 20px;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .as-logo-dot {
          width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
        }

        .as-logo-text {
          font-size: 13px; font-weight: 700;
          color: #fff; letter-spacing: -0.01em;
        }

        .as-logo-badge {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #0ea5e9; background: rgba(14,165,233,0.12);
          padding: 2px 6px; border-radius: 4px;
          margin-left: auto;
        }

        .as-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }

        .as-nav-label {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 0 10px; margin: 12px 0 6px;
        }

        .as-item {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 9px;
          text-decoration: none; width: 100%;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.45);
          border: none; background: none; cursor: pointer;
          transition: all 0.15s; text-align: left;
        }

        .as-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }

        .as-item-active {
          background: rgba(14,165,233,0.12) !important;
          color: #38bdf8 !important;
        }

        .as-item-active svg { color: #0ea5e9; }

        .as-footer {
          padding: 10px; border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 2px;
        }

        .as-item-danger:hover { background: rgba(239,68,68,0.1) !important; color: #f87171 !important; }
      `}</style>

      <aside className="as-root">
        <div className="as-logo">
          <div className="as-logo-dot">A</div>
          <span className="as-logo-text">MyStore</span>
          <span className="as-logo-badge">Admin</span>
        </div>

        <nav className="as-nav">
          <p className="as-nav-label">Main</p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`as-item ${isActive ? "as-item-active" : ""}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}

          <p className="as-nav-label" style={{ marginTop: 20 }}>
            Store
          </p>
          <Link href="/" target="_blank" className="as-item">
            <ExternalLink size={15} /> View store
          </Link>
          <Link href="/admin/settings" className="as-item">
            <Settings size={15} /> Settings
          </Link>
        </nav>

        <div className="as-footer">
          <button
            className="as-item as-item-danger"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
