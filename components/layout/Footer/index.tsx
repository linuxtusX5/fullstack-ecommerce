import { Fragment } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Women", href: "/category/women" },
    { label: "Men", href: "/category/men" },
    { label: "Accessories", href: "/category/accessories" },
    { label: "Sale", href: "/products?sort=price-asc" },
  ],
  Account: [
    { label: "My Profile", href: "/account/profile" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "Addresses", href: "/account/addresses" },
    { label: "Sign In", href: "/login" },
  ],
  Help: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Affiliate", href: "/affiliate" },
  ],
};

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
];

const payments = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600&display=swap');

        .footer {
          background: #0a0f1a;
          color: rgba(255,255,255,0.6);
          font-family: 'Sora', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Subtle top gradient border */
        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(14,165,233,0.4) 30%,
            rgba(14,165,233,0.6) 50%,
            rgba(14,165,233,0.4) 70%,
            transparent 100%
          );
        }

        /* Ambient glow blobs */
        .footer-glow-1 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%);
          top: -100px; left: -100px;
          pointer-events: none;
        }

        .footer-glow-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%);
          bottom: 0; right: 10%;
          pointer-events: none;
        }

        /* ── Top section ── */
        .footer-top {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 48px 56px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 48px;
          position: relative;
          z-index: 1;
        }

        /* Brand column */
        .footer-brand {}

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 20px;
        }

        .footer-logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #0ea5e9;
          box-shadow: 0 0 10px rgba(14,165,233,0.7);
        }

        .footer-logo-text {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.04em;
        }

        .footer-tagline {
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.45);
          max-width: 260px;
          margin-bottom: 28px;
        }

        /* Socials */
        .footer-socials {
          display: flex;
          gap: 10px;
          margin-bottom: 32px;
        }

        .footer-social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.2s;
        }

        .footer-social-btn:hover {
          border-color: #0ea5e9;
          background: rgba(14,165,233,0.1);
          color: #0ea5e9;
          transform: translateY(-2px);
        }

        /* App badges */
        .footer-app-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-app-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          text-decoration: none;
          transition: all 0.2s;
          width: fit-content;
        }

        .footer-app-badge:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
        }

        .footer-app-badge-sub {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 1;
        }

        .footer-app-badge-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
          margin-top: 3px;
        }

        /* Link columns */
        .footer-col-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-link {
          font-size: 13.5px;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }

        .footer-link:hover {
          color: #fff;
          transform: translateX(4px);
        }

        /* ── Middle divider ── */
        .footer-divider {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          position: relative;
          z-index: 1;
        }

        .footer-divider-line {
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        /* ── Payment strip ── */
        .footer-payments {
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 48px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .footer-payments-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-right: 4px;
        }

        .footer-payment-chip {
          padding: 5px 12px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.03);
          letter-spacing: 0.03em;
          transition: all 0.2s;
        }

        .footer-payment-chip:hover {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 48px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .footer-copyright {
          font-size: 12.5px;
          color: rgba(255,255,255,0.25);
        }

        .footer-copyright strong {
          color: rgba(255,255,255,0.45);
          font-weight: 600;
        }

        .footer-legal {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .footer-legal-link {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal-link:hover { color: rgba(255,255,255,0.6); }

        .footer-legal-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .footer-top {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 40px;
          }
          .footer-brand { grid-column: 1 / -1; }
          .footer-app-badges { flex-direction: row; }
        }

        @media (max-width: 640px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            padding: 48px 24px 40px;
            gap: 32px;
          }
          .footer-brand { grid-column: 1 / -1; }
          .footer-divider,
          .footer-payments,
          .footer-bottom {
            padding-left: 24px;
            padding-right: 24px;
          }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-glow-1" />
        <div className="footer-glow-2" />

        {/* ── Top grid ── */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="footer-logo-dot" />
              <span className="footer-logo-text">{siteConfig.name}</span>
            </Link>

            <p className="footer-tagline">
              Curated fashion for the modern wardrobe. Quality pieces, timeless
              style, delivered to your door.
            </p>

            {/* Socials */}
            <div className="footer-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer-social-btn"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* App store badges */}
            <div className="footer-app-badges">
              <a href="#" className="footer-app-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="footer-app-badge-sub">Download on the</p>
                  <p className="footer-app-badge-name">App Store</p>
                </div>
              </a>
              <a href="#" className="footer-app-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-12.6L13.6 8.2 3.18 23.76zM20.7 10.67L17.9 9.1l-3.3 3.3 3.3 3.3 2.84-1.59c.81-.45.81-1.99-.04-2.44zM3 1.2C2.98 1.37 3 1.55 3 1.73v20.54c0 .18-.01.36.18.5l12.5-12.5L3 1.2zM13.6 15.8l3.17-3.17-12.6-12.6c-.34-.04-.68.02-.99.2L13.6 15.8z" />
                </svg>
                <div>
                  <p className="footer-app-badge-sub">Get it on</p>
                  <p className="footer-app-badge-name">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="footer-col-title">{title}</h4>
              <ul className="footer-links">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider">
          <div className="footer-divider-line" />
        </div>

        {/* ── Payment methods ── */}
        <div className="footer-payments">
          <span className="footer-payments-label">We accept</span>
          {payments.map((p) => (
            <span key={p} className="footer-payment-chip">
              {p}
            </span>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider">
          <div className="footer-divider-line" />
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} <strong>{siteConfig.name}</strong>. All rights reserved.
          </p>

          <nav className="footer-legal" aria-label="Legal">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
              { label: "Accessibility", href: "/accessibility" },
            ].map((item, i, arr) => (
              <Fragment key={item.href}>
                <Link href={item.href} className="footer-legal-link">
                  {item.label}
                </Link>
                {i < arr.length - 1 && <span className="footer-legal-dot" />}
              </Fragment>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
