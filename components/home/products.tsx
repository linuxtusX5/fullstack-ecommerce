import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithCategory } from "@/types";

// ── FeaturedProducts ──────────────────────────────────────────────────────────

export function FeaturedProducts({
  products,
}: {
  products: ProductWithCategory[];
}) {
  if (!products.length) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@400;500;600&display=swap');

        .fp-section {
          padding: 0 24px 80px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .fp-head {
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

        .fp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) { .fp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .fp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 400px)  { .fp-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="fp-section">
        <div className="fp-head">
          <div>
            <p className="section-eyebrow">Handpicked</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link href="/products?featured=true" className="section-link">
            View all →
          </Link>
        </div>
        <div className="fp-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

// ── NewArrivals ───────────────────────────────────────────────────────────────

export function NewArrivals({ products }: { products: ProductWithCategory[] }) {
  if (!products.length) return null;

  return (
    <>
      <style>{`
        .na-section {
          padding: 0 24px 96px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .na-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        .na-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) { .na-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .na-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 400px)  { .na-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="na-section">
        <div className="na-head">
          <div>
            <p className="section-eyebrow">Just dropped</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link href="/products?sort=newest" className="section-link">
            See all new →
          </Link>
        </div>
        <div className="na-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

// ── ProductGridSkeleton ───────────────────────────────────────────────────────

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      <style>{`
        .skeleton-section {
          padding: 0 24px 80px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .skeleton-card { display: flex; flex-direction: column; gap: 10px; }

        .skeleton-img {
          aspect-ratio: 1;
          border-radius: 16px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-line {
          height: 14px;
          border-radius: 7px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @media (max-width: 768px) { .skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="skeleton-section">
        <div className="skeleton-grid">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line" style={{ width: "60%" }} />
              <div className="skeleton-line" style={{ width: "40%" }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
