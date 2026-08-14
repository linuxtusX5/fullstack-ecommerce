import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.name} — MyStore` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { slug } = await params;
  const { sort, page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const limit = 12;

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const orderBy: any =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where: { category: { slug } },
      include: { category: true },
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.product.count({ where: { category: { slug } } }),
  ]);

  const pages = Math.ceil(total / limit);

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low", value: "price-asc" },
    { label: "Price: High", value: "price-desc" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

        .cp-hero {
          background: #0f172a; padding: 48px 24px 56px;
          position: relative; overflow: hidden;
        }
        .cp-hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 100%, rgba(14,165,233,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .cp-hero-inner {
          max-width: 1280px; margin: 0 auto;
          position: relative; z-index: 1;
        }
        .cp-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }
        .cp-breadcrumb a { color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        .cp-breadcrumb a:hover { color: rgba(255,255,255,0.8); }
        .cp-breadcrumb-sep { color: rgba(255,255,255,0.2); }
        .cp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 44px); font-weight: 700;
          color: #fff; letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .cp-count {
          font-family: 'Sora', sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.4);
        }

        .cp-body {
          max-width: 1280px; margin: 0 auto;
          padding: 32px 24px 80px;
        }

        .cp-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
        }

        .cp-sort {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Sora', sans-serif;
        }
        .cp-sort-label { font-size: 12px; color: #94a3b8; }
        .cp-sort-btns { display: flex; gap: 6px; }
        .cp-sort-btn {
          height: 32px; padding: 0 14px;
          border-radius: 8px; border: 1.5px solid #e2e8f0;
          background: #fff; font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 500; color: #64748b;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center; transition: all 0.15s;
        }
        .cp-sort-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .cp-sort-btn-active { border-color: #0ea5e9 !important; color: #0ea5e9 !important; background: #f0f9ff !important; font-weight: 600 !important; }

        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }

        .cp-empty {
          grid-column: 1 / -1; text-align: center;
          padding: 64px 24px; color: #94a3b8;
          font-family: 'Sora', sans-serif; font-size: 14px;
        }

        .cp-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-top: 48px; flex-wrap: wrap;
          font-family: 'Sora', sans-serif;
        }
        .cp-page-btn {
          height: 36px; min-width: 36px; padding: 0 12px;
          border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #fff; font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 500; color: #64748b;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .cp-page-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .cp-page-btn-active { border-color: #0f172a !important; background: #0f172a !important; color: #fff !important; }
        .cp-page-btn-disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

        @media (max-width: 640px) {
          .cp-body { padding: 24px 16px 60px; }
          .cp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>

      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <div className="cp-breadcrumb">
            <Link href="/">Home</Link>
            <span className="cp-breadcrumb-sep">/</span>
            <Link href="/products">Products</Link>
            <span className="cp-breadcrumb-sep">/</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              {category.name}
            </span>
          </div>
          <h1 className="cp-title">{category.name}</h1>
          <p className="cp-count">
            {total} product{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="cp-body">
        {/* Toolbar */}
        <div className="cp-toolbar">
          <div className="cp-sort">
            <span className="cp-sort-label">Sort by:</span>
            <div className="cp-sort-btns">
              {sortOptions.map((o) => (
                <Link
                  key={o.value}
                  href={`/category/${slug}?sort=${o.value}`}
                  className={`cp-sort-btn ${(sort ?? "newest") === o.value ? "cp-sort-btn-active" : ""}`}
                >
                  {o.label}
                </Link>
              ))}
            </div>
          </div>
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              fontFamily: "Sora,sans-serif",
            }}
          >
            {total} results
          </span>
        </div>

        {/* Grid */}
        <div className="cp-grid">
          {products.length === 0 ? (
            <div className="cp-empty">No products in this category yet.</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="cp-pagination">
            {page > 1 && (
              <Link
                href={`/category/${slug}?page=${page - 1}${sort ? `&sort=${sort}` : ""}`}
                className="cp-page-btn"
              >
                ← Prev
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/category/${slug}?page=${p}${sort ? `&sort=${sort}` : ""}`}
                className={`cp-page-btn ${p === page ? "cp-page-btn-active" : ""}`}
              >
                {p}
              </Link>
            ))}
            {page < pages && (
              <Link
                href={`/category/${slug}?page=${page + 1}${sort ? `&sort=${sort}` : ""}`}
                className="cp-page-btn"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
