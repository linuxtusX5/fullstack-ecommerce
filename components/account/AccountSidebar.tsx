"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, ShoppingBag, Heart, MapPin, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

        .as-root {
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 18px;
          overflow: hidden;
          position: sticky;
          top: 88px;
          font-family: 'Sora', sans-serif;
        }

        .as-nav { padding: 8px; }

        .as-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 11px;
          text-decoration: none; width: 100%;
          font-size: 13px; font-weight: 500;
          color: #475569; border: none; background: none;
          cursor: pointer; text-align: left;
          transition: all 0.15s;
        }

        .as-item:hover { background: #f8fafc; color: #0f172a; }

        .as-item-active {
          background: #f0f9ff;
          color: #0284c7;
          font-weight: 600;
        }

        .as-item-active svg { color: #0ea5e9; }

        .as-divider {
          height: 1px; background: #f1f5f9;
          margin: 6px 14px;
        }

        .as-logout {
          color: #ef4444 !important;
        }

        .as-logout:hover { background: #fef2f2 !important; }
      `}</style>

      <nav className="as-root">
        <div className="as-nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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

          <div className="as-divider" />

          <button
            className="as-item as-logout"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </nav>
    </>
  );
}
