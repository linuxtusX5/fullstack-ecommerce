import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: { id: string; name: string; slug: string };
};

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

        .pc-root {
          display: block;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
        }

        .pc-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 16px;
          overflow: hidden;
          background: #f1f5f9;
          margin-bottom: 12px;
        }

        .pc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }

        .pc-root:hover .pc-img { transform: scale(1.06); }

        .pc-out {
          position: absolute; inset: 0;
          background: rgba(15,23,42,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 2;
        }

        .pc-out span {
          background: rgba(15,23,42,0.8);
          color: #fff;
          font-size: 11px; font-weight: 600;
          padding: 6px 14px; border-radius: 100px;
          letter-spacing: 0.05em;
        }

        .pc-cat {
          font-size: 11px; color: #94a3b8;
          font-weight: 500; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 4px;
        }

        .pc-name {
          font-size: 14px; font-weight: 600;
          color: #0f172a; line-height: 1.35;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
        }

        .pc-root:hover .pc-name { color: #0ea5e9; }

        .pc-price {
          font-size: 15px; font-weight: 700; color: #0f172a;
        }
      `}</style>

      <Link href={`/products/${product.slug}`} className="pc-root">
        <div className="pc-img-wrap">
          <img
            src={
              product.images?.[0] ??
              "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80"
            }
            alt={product.name}
            className="pc-img"
          />
          {outOfStock && (
            <div className="pc-out">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        <p className="pc-cat">{product.category.name}</p>
        <h3 className="pc-name">{product.name}</h3>
        <span className="pc-price">${product.price.toFixed(2)}</span>
      </Link>
    </>
  );
}
