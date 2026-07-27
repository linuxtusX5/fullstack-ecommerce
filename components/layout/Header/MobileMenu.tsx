"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  X,
  Home,
  ShoppingBag,
  Tag,
  Heart,
  User,
  Package,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/config/site";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const shopLinks = [
  { label: "New Arrivals", href: "/products?sort=newest", icon: Sparkles },
  { label: "All Products", href: "/products", icon: ShoppingBag },
  { label: "Men", href: "/category/men", icon: Tag },
  { label: "Women", href: "/category/women", icon: Tag },
  { label: "Accessories", href: "/category/accessories", icon: Tag },
  { label: "Sale", href: "/products?sort=price-asc", icon: Tag, accent: true },
];

const accountLinks = [
  { label: "My Profile", href: "/account/profile", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
];

export function MobileMenu({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        /* Backdrop */
        .mm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.5);
          backdrop-filter: blur(4px);
          z-index: 60;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mm-backdrop-open {
          opacity: 1;
          visibility: visible;
        }

        /* Drawer */
        .mm-drawer {
          position: fixed;
          top: 0; left: 0;
          width: min(320px, 85vw);
          height: 100dvh;
          background: #fff;
          z-index: 61;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Sora', sans-serif;
        }

        .mm-drawer-open {
          transform: translateX(0);
        }

        /* Header */
        .mm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }

        .mm-logo {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.04em;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .mm-logo-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #0ea5e9;
          box-shadow: 0 0 8px rgba(14,165,233,0.6);
        }

        .mm-close {
          width: 36px; height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          background: none;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .mm-close:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }

        /* Scrollable body */
        .mm-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px 12px 24px;
        }

        .mm-section-label {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 10px 6px;
        }

        .mm-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s;
          position: relative;
        }

        .mm-link:hover { background: #f8fafc; color: #0f172a; }

        .mm-link-active {
          background: #f0f9ff;
          color: #0284c7;
          font-weight: 600;
        }

        .mm-link-accent { color: #ef4444 !important; }
        .mm-link-accent:hover { background: #fef2f2 !important; }

        .mm-link-icon {
          width: 34px; height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f1f5f9;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .mm-link:hover .mm-link-icon { background: #e2e8f0; }
        .mm-link-active .mm-link-icon { background: #e0f2fe; }

        .mm-link-arrow {
          margin-left: auto;
          color: #cbd5e1;
        }

        .mm-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 10px 0;
        }

        /* User card */
        .mm-user-card {
          margin: 8px 0;
          padding: 14px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mm-user-avatar {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .mm-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        .mm-user-email {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }

        /* Sign out */
        .mm-signout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 10px;
          border-radius: 10px;
          color: #ef4444;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Sora', sans-serif;
          transition: all 0.15s;
        }

        .mm-signout:hover { background: #fef2f2; }

        .mm-signout-icon {
          width: 34px; height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #fee2e2;
        }

        /* Auth buttons */
        .mm-auth-btns {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .mm-btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border-radius: 10px;
          background: #0f172a;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .mm-btn-primary:hover { background: #1e293b; }

        .mm-btn-outline {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #374151;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }

        .mm-btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`mm-backdrop ${isOpen ? "mm-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`mm-drawer ${isOpen ? "mm-drawer-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="mm-header">
          <Link href="/" className="mm-logo" onClick={onClose}>
            <span className="mm-logo-dot" />
            {siteConfig.name}
          </Link>
          <button
            className="mm-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="mm-body">
          {/* User info card if logged in */}
          {session && (
            <div className="mm-user-card">
              <div className="mm-user-avatar">
                <User size={18} />
              </div>
              <div style={{ overflow: "hidden" }}>
                <p className="mm-user-name">
                  {session.user?.name ?? "My Account"}
                </p>
                <p className="mm-user-email">{session.user?.email}</p>
              </div>
            </div>
          )}

          {/* Shop */}
          <p className="mm-section-label">Shop</p>
          {shopLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mm-link ${item.accent ? "mm-link-accent" : ""}`}
              onClick={onClose}
            >
              <span className="mm-link-icon">
                <item.icon
                  size={15}
                  color={item.accent ? "#ef4444" : "#64748b"}
                />
              </span>
              {item.label}
              <ChevronRight size={14} className="mm-link-arrow" />
            </Link>
          ))}

          <div className="mm-divider" />

          {/* Pages */}
          <p className="mm-section-label">Pages</p>
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mm-link"
              onClick={onClose}
            >
              <span className="mm-link-icon">
                <Home size={15} color="#64748b" />
              </span>
              {item.label}
              <ChevronRight size={14} className="mm-link-arrow" />
            </Link>
          ))}

          {/* Account section */}
          {session ? (
            <>
              <div className="mm-divider" />
              <p className="mm-section-label">Account</p>
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mm-link"
                  onClick={onClose}
                >
                  <span className="mm-link-icon">
                    <item.icon size={15} color="#64748b" />
                  </span>
                  {item.label}
                  <ChevronRight size={14} className="mm-link-arrow" />
                </Link>
              ))}
              <div className="mm-divider" />
              <button
                className="mm-signout"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  onClose();
                }}
              >
                <span className="mm-signout-icon">
                  <LogOut size={15} color="#ef4444" />
                </span>
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="mm-divider" />
              <div className="mm-auth-btns">
                <Link
                  href="/login"
                  className="mm-btn-primary"
                  onClick={onClose}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="mm-btn-outline"
                  onClick={onClose}
                >
                  Create account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
