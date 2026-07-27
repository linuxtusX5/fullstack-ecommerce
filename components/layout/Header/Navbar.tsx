"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { siteConfig } from "@/config/site";

type Props = {
  scrolled: boolean;
  mobileOpen: boolean;
  onMobileMenuToggle: () => void;
  onSearchOpen: () => void;
};

type Category = { id: string; name: string; slug: string };

export function Navbar({
  scrolled,
  mobileOpen,
  onMobileMenuToggle,
  onSearchOpen,
}: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const totalItems = useCartStore((s: any) => s.getTotalItems());
  const toggleCart = useCartStore((s: any) => s.toggleCart);
  const [mounted, setMounted] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    setMounted(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));

  }, []);

  const cartCount = mounted ? totalItems : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        .nav-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 32px;
          font-family: 'Sora', sans-serif;
        }

        /* Logo */
        .nav-logo {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          text-decoration: none;
          letter-spacing: -0.04em;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #0ea5e9;
          display: inline-block;
          box-shadow: 0 0 8px rgba(14,165,233,0.6);
        }

        /* Desktop nav links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
          flex: 1;
        }

        .nav-link {
          position: relative;
          padding: 6px 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-link:hover { color: #0f172a; background: #f1f5f9; }

        .nav-link-active {
          color: #0f172a;
          font-weight: 600;
        }

        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 12px;
          right: 12px;
          height: 2px;
          border-radius: 2px;
          background: #0ea5e9;
        }

        .nav-link-accent { color: #ef4444 !important; font-weight: 600; }
        .nav-link-accent:hover { background: #fef2f2 !important; }

        /* Dropdown */
        .nav-dropdown {
          position: relative;
        }

        .nav-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .nav-dropdown-trigger:hover { color: #0f172a; background: #f1f5f9; }

        .nav-dropdown-trigger svg {
          transition: transform 0.2s;
        }

        .nav-dropdown:hover .nav-dropdown-trigger svg {
          transform: rotate(180deg);
        }

        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px;
          min-width: 200px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
          z-index: 100;
        }

        .nav-dropdown:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .nav-dropdown-item {
          display: block;
          padding: 9px 14px;
          font-size: 13px;
          color: #374151;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.15s;
          font-weight: 500;
        }

        .nav-dropdown-item:hover {
          background: #f8fafc;
          color: #0f172a;
          padding-left: 18px;
        }

        /* Right actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .nav-icon-btn {
          position: relative;
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          background: none;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
          text-decoration: none;
        }

        .nav-icon-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .nav-badge {
          position: absolute;
          top: 4px; right: 4px;
          min-width: 17px; height: 17px;
          background: #0ea5e9;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #fff;
          font-family: 'Sora', sans-serif;
          animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* User dropdown */
        .nav-user {
          position: relative;
        }

        .nav-user-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px;
          min-width: 180px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
          z-index: 100;
        }

        .nav-user:hover .nav-user-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .nav-user-item {
          display: block;
          padding: 9px 14px;
          font-size: 13px;
          color: #374151;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.15s;
          font-weight: 500;
          font-family: 'Sora', sans-serif;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .nav-user-item:hover { background: #f8fafc; color: #0f172a; }

        .nav-user-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 6px 0;
        }

        .nav-user-signout { color: #ef4444 !important; }
        .nav-user-signout:hover { background: #fef2f2 !important; }

        /* Auth CTA */
        .nav-cta {
          height: 36px;
          padding: 0 16px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-cta:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15,23,42,0.25);
        }

        /* Mobile toggle */
        .nav-mobile-toggle {
          display: none;
          width: 40px; height: 40px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          background: none;
          cursor: pointer;
          color: #475569;
          transition: all 0.2s;
        }

        .nav-mobile-toggle:hover { background: #f1f5f9; color: #0f172a; }

        @media (max-width: 768px) {
          .nav-links        { display: none; }
          .nav-mobile-toggle { display: flex; }
          .nav-desktop-only { display: none; }
        }

        @media (max-width: 480px) {
          .nav-wrap { padding: 0 16px; gap: 8px; }
        }
      `}</style>

      <nav className="nav-wrap">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          {siteConfig.name}
        </Link>

        {/* Desktop nav links */}
        <ul className="nav-links">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link ${pathname === item.href ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Categories dropdown */}
          <li className="nav-dropdown">
            <button className="nav-dropdown-trigger">
              Categories
              <ChevronDown size={14} />
            </button>
            <div className="nav-dropdown-menu">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="nav-dropdown-item"
                >
                  {cat.name}
                </Link>
              ))}
              {categories.length > 0 && (
                <div className="nav-dropdown-divider" />
              )}
              <Link
                href="/products"
                className="nav-dropdown-item nav-dropdown-all"
              >
                All products →
              </Link>
            </div>
          </li>
        </ul>

        {/* Right actions */}
        <div className="nav-actions">
          {/* Search */}
          <button
            className="nav-icon-btn"
            onClick={onSearchOpen}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Wishlist */}
          <Link
            href="/account/wishlist"
            className="nav-icon-btn nav-desktop-only"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>
          {/* Cart */}
          <button
            className="nav-icon-btn"
            onClick={toggleCart}
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="nav-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* User */}
          {session ? (
            <div className="nav-user nav-desktop-only">
              <button className="nav-icon-btn" aria-label="Account">
                <User size={18} />
              </button>
              <div className="nav-user-menu">
                <div
                  style={{
                    padding: "8px 14px 6px",
                    borderBottom: "1px solid #f1f5f9",
                    marginBottom: 6,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      fontFamily: "Sora,sans-serif",
                    }}
                  >
                    Signed in as
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0f172a",
                      fontFamily: "Sora,sans-serif",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {session.user?.email}
                  </p>
                </div>
                <Link href="/account" className="nav-user-item">
                  My Profile
                </Link>
                <Link href="/account/orders" className="nav-user-item">
                  My Orders
                </Link>
                <Link href="/account/wishlist" className="nav-user-item">
                  Wishlist
                </Link>
                <div className="nav-user-divider" />
                <button
                  className="nav-user-item nav-user-signout"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="nav-cta nav-desktop-only">
              Sign in
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={onMobileMenuToggle}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </>
  );
}
