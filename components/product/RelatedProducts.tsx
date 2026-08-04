import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: { id: string; name: string; slug: string };
};

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <>
      <style>{`
        .rp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @keyframes rpFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .rp-item {
          animation: rpFadeUp 0.4s ease both;
        }

        @media (max-width: 1024px) { .rp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .rp-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="rp-grid">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="rp-item"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </>
  );
}
