import { ProductCard } from "./ProductCard";
import type { ProductWithCategory } from "@/types";

export function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  return (
    <>
      <style>{`
        .pg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @keyframes pgFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pg-item {
          animation: pgFadeUp 0.45s ease both;
        }

        @media (max-width: 1280px) { .pg-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px)  { .pg-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .pg-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pg-grid">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="pg-item"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <>
      <style>{`
        .pgs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .pgs-card { display: flex; flex-direction: column; gap: 10px; }

        .pgs-img {
          aspect-ratio: 3/4;
          border-radius: 16px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: pgsShimmer 1.4s infinite;
        }

        .pgs-line {
          height: 13px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: pgsShimmer 1.4s infinite;
        }

        @keyframes pgsShimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @media (max-width: 900px) { .pgs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .pgs-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pgs-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="pgs-card">
            <div
              className="pgs-img"
              style={{ animationDelay: `${i * 0.06}s` }}
            />
            <div
              className="pgs-line"
              style={{ width: "65%", animationDelay: `${i * 0.06}s` }}
            />
            <div
              className="pgs-line"
              style={{ width: "40%", animationDelay: `${i * 0.06}s` }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
