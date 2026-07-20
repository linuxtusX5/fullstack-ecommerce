"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

// ── TrustBar ─────────────────────────────────────────────────────────────────

const trustItems = [
  { icon: Truck, title: "Free Shipping", sub: "On orders over $75" },
  { icon: RotateCcw, title: "Free Returns", sub: "30-day hassle-free" },
  { icon: ShieldCheck, title: "Secure Payment", sub: "256-bit SSL encrypted" },
  { icon: Headphones, title: "24/7 Support", sub: "We're always here" },
];

export function TrustBar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

        .trust-bar {
          background: #0f172a;
          padding: 0 24px;
        }

        .trust-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 24px;
          border-right: 1px solid rgba(255,255,255,0.07);
          font-family: 'Sora', sans-serif;
        }

        .trust-item:last-child { border-right: none; }

        .trust-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(14,165,233,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .trust-title {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          line-height: 1.2;
        }

        .trust-sub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.45);
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .trust-inner { grid-template-columns: repeat(2, 1fr); }
          .trust-item  { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 16px; }
        }

        @media (max-width: 480px) {
          .trust-inner { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="trust-bar">
        <div className="trust-inner">
          {trustItems.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="trust-item">
              <div className="trust-icon">
                <Icon size={18} color="#0ea5e9" />
              </div>
              <div>
                <p className="trust-title">{title}</p>
                <p className="trust-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── CategoryStrip ─────────────────────────────────────────────────────────────

const fallbackCategories = [
  {
    id: "1",
    name: "Women",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
    _count: { products: 120 },
  },
  {
    id: "2",
    name: "Men",
    slug: "men",
    image:
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&q=80",
    _count: { products: 84 },
  },
  {
    id: "3",
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80",
    _count: { products: 56 },
  },
  {
    id: "4",
    name: "Shoes",
    slug: "shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    _count: { products: 63 },
  },
  {
    id: "5",
    name: "Sport",
    slug: "sport",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    _count: { products: 48 },
  },
  {
    id: "6",
    name: "Beauty",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    _count: { products: 37 },
  },
];

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  _count: { products: number };
};

export function CategoryStrip({ categories }: { categories?: Category[] }) {
  const cats =
    categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <>
      <style>{`
        .cat-section {
          padding: 72px 24px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .cat-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        .section-eyebrow {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0ea5e9;
          margin-bottom: 8px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .section-link {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0ea5e9;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
          white-space: nowrap;
        }

        .section-link:hover { gap: 8px; }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .cat-card {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          group: true;
        }

        .cat-img-wrap {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: #f1f5f9;
        }

        .cat-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }

        .cat-card:hover .cat-img-wrap img {
          transform: scale(1.08);
        }

        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .cat-card:hover .cat-overlay { opacity: 1; }

        .cat-name {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          text-align: center;
        }

        .cat-count {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
          margin-top: -8px;
        }

        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px)  { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <section className="cat-section">
        <div className="cat-section-head">
          <div>
            <p className="section-eyebrow">Browse</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link href="/products" className="section-link">
            All categories →
          </Link>
        </div>

        <div className="cat-grid">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="cat-card"
            >
              <div className="cat-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    cat.image ??
                    `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80`
                  }
                  alt={cat.name}
                />
                <div className="cat-overlay" />
              </div>
              <p className="cat-name">{cat.name}</p>
              <p className="cat-count">{cat._count.products} items</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

// ── PromoBanner ───────────────────────────────────────────────────────────────

export function Promobanner() {
  return (
    <>
      <style>{`
        .promo-wrap {
          padding: 0 24px 72px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .promo-banner {
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          min-height: 380px;
          display: flex;
          align-items: center;
          background: #0f172a;
        }

        .promo-bg {
          position: absolute;
          inset: 0;
          opacity: 0.35;
        }

        .promo-bg img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .promo-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .promo-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.3), transparent);
        }

        .promo-circle-1 {
          width: 400px; height: 400px;
          right: -80px; top: -80px;
        }

        .promo-circle-2 {
          width: 250px; height: 250px;
          left: 20%; bottom: -60px;
          background: radial-gradient(circle, rgba(245,158,11,0.2), transparent);
        }

        .promo-content {
          position: relative;
          z-index: 2;
          padding: 56px 64px;
          max-width: 580px;
        }

        .promo-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245,158,11,0.2);
          border: 1px solid rgba(245,158,11,0.4);
          border-radius: 100px;
          padding: 5px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #f59e0b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .promo-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .promo-title em {
          color: #f59e0b;
          font-style: italic;
        }

        .promo-desc {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .promo-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 50px;
          padding: 0 28px;
          background: #f59e0b;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.25s;
        }

        .promo-cta:hover {
          background: #fbbf24;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(245,158,11,0.4);
        }

        .promo-countdown {
          position: absolute;
          right: 64px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 16px;
          z-index: 2;
        }

        .countdown-block {
          text-align: center;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 16px 20px;
          min-width: 72px;
        }

        .countdown-num {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .countdown-label {
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        @media (max-width: 900px) {
          .promo-countdown { display: none; }
          .promo-content   { padding: 40px 32px; }
        }

        @media (max-width: 600px) {
          .promo-content { padding: 32px 24px; }
        }
      `}</style>

      <div className="promo-wrap">
        <div className="promo-banner">
          <div className="promo-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=70"
              alt=""
            />
          </div>
          <div className="promo-shapes">
            <div className="promo-circle promo-circle-1" />
            <div className="promo-circle promo-circle-2" />
          </div>

          <div className="promo-content">
            <div className="promo-badge">🔥 Limited Time</div>
            <h2 className="promo-title">
              Up to <em>40% Off</em>
              <br />
              Summer Sale
            </h2>
            <p className="promo-desc">
              Hundreds of styles slashed. Stock is limited — grab your
              favourites before they&apos;re gone.
            </p>
            <Link href="/products?sort=price-asc" className="promo-cta">
              Shop the Sale →
            </Link>
          </div>

          <PromoCountdown />
        </div>
      </div>
    </>
  );
}

function PromoCountdown() {
  const [time, setTime] = useState({ h: 11, m: 59, s: 59 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="promo-countdown">
      {[
        { v: pad(time.h), l: "Hours" },
        { v: pad(time.m), l: "Mins" },
        { v: pad(time.s), l: "Secs" },
      ].map(({ v, l }) => (
        <div key={l} className="countdown-block">
          <p className="countdown-num">{v}</p>
          <p className="countdown-label">{l}</p>
        </div>
      ))}
    </div>
  );
}

// ── NewsletterSection ─────────────────────────────────────────────────────────

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("done");
  };

  return (
    <>
      <style>{`
        .nl-section {
          background: #f8fafc;
          padding: 96px 24px;
          text-align: center;
        }

        .nl-inner {
          max-width: 560px;
          margin: 0 auto;
        }

        .nl-eyebrow {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0ea5e9;
          margin-bottom: 12px;
        }

        .nl-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }

        .nl-sub {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .nl-form {
          display: flex;
          gap: 10px;
          max-width: 440px;
          margin: 0 auto;
        }

        .nl-input {
          flex: 1;
          height: 50px;
          padding: 0 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          color: #0f172a;
          background: #fff;
          outline: none;
          transition: all 0.2s;
        }

        .nl-input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
        }

        .nl-input::placeholder { color: #94a3b8; }

        .nl-btn {
          height: 50px;
          padding: 0 24px;
          background: #0f172a;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .nl-btn:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15,23,42,0.2);
        }

        .nl-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .nl-done {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #10b981;
          height: 50px;
        }

        .nl-privacy {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: #94a3b8;
          margin-top: 14px;
        }

        @media (max-width: 480px) {
          .nl-form { flex-direction: column; }
          .nl-btn  { width: 100%; }
        }
      `}</style>

      <section className="nl-section">
        <div className="nl-inner">
          <p className="nl-eyebrow">Newsletter</p>
          <h2 className="nl-title">Stay in the Loop</h2>
          <p className="nl-sub">
            Get early access to new drops, exclusive offers and style
            inspiration — straight to your inbox.
          </p>

          {status === "done" ? (
            <div className="nl-done">
              ✓ You&apos;re on the list! Welcome aboard.
            </div>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit}>
              <input
                className="nl-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="nl-btn"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}

          <p className="nl-privacy">No spam, ever. Unsubscribe at any time.</p>
        </div>
      </section>
    </>
  );
}
