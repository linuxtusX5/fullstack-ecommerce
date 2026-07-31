import { Suspense } from "react";
import { getProducts } from "@/services/productService";
import { db } from "@/lib/db";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { Pagination } from "@/components/common/Pagination";
import type { FilterParams } from "@/types";

export const metadata = {
  title: "All Products — MyStore",
  description: "Browse our full collection of curated products.",
};

// ✅ Next.js 16: searchParams is a Promise
type SearchParams = Promise<{
  page?: string;
  sort?: string;
  category?: string;
  min?: string;
  max?: string;
  search?: string;
}>;

async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const filters: FilterParams = {
    page,
    limit: 12,
    sort: (params.sort as FilterParams["sort"]) || "newest",
    category: params.category,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    search: params.search,
  };

  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts(filters).catch(() => ({
      products: [],
      total: 0,
      pages: 0,
      page: 1,
    })),
    getCategories(),
  ]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

        .pl-hero {
          background: #0f172a;
          padding: 52px 48px 48px;
          position: relative;
          overflow: hidden;
        }

        .pl-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 80% at 0% 50%, rgba(14,165,233,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 100% 50%, rgba(245,158,11,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .pl-hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .pl-hero-eyebrow {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0ea5e9;
          margin-bottom: 10px;
        }

        .pl-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .pl-hero-sub {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
        }

        .pl-hero-count {
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 5px 16px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .pl-hero-count strong { color: #fff; font-weight: 700; }

        .pl-layout {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 48px 80px;
          display: grid;
          grid-template-columns: 256px 1fr;
          gap: 40px;
          align-items: start;
        }

        .pl-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pl-result-label { font-family: 'Sora', sans-serif; font-size: 13px; color: #64748b; }
        .pl-result-label strong { color: #0f172a; font-weight: 700; }

        .pl-active-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; align-items: center; }

        .pl-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 100px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #0284c7;
          text-decoration: none;
          transition: background 0.15s;
        }

        .pl-filter-chip:hover { background: #e0f2fe; }

        .pl-clear-all {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: #ef4444;
          text-decoration: none;
          font-weight: 500;
        }

        .pl-clear-all:hover { text-decoration: underline; }

        .pl-empty { text-align: center; padding: 80px 24px; }
        .pl-empty-icon { font-size: 48px; margin-bottom: 16px; }
        .pl-empty-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .pl-empty-sub { font-family: 'Sora', sans-serif; font-size: 14px; color: #94a3b8; margin-bottom: 24px; }

        .pl-empty-btn {
          display: inline-flex;
          align-items: center;
          height: 44px;
          padding: 0 24px;
          background: #0f172a;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .pl-empty-btn:hover { background: #1e293b; }

        @media (max-width: 1024px) {
          .pl-layout { grid-template-columns: 220px 1fr; gap: 28px; padding: 32px 24px 60px; }
        }

        @media (max-width: 768px) {
          .pl-layout { grid-template-columns: 1fr; padding: 24px 16px 60px; }
          .pl-hero    { padding: 36px 24px 32px; }
        }
      `}</style>

      {/* Hero */}
      <div className="pl-hero">
        <div className="pl-hero-inner">
          <p className="pl-hero-eyebrow">Our Collection</p>
          <h1 className="pl-hero-title">
            {params.search
              ? `Results for "${params.search}"`
              : params.category
                ? params.category.charAt(0).toUpperCase() +
                  params.category.slice(1)
                : "All Products"}
          </h1>
          <p className="pl-hero-sub">
            Discover our curated selection of premium pieces.
          </p>
          <div className="pl-hero-count">
            <strong>{total}</strong> products found
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="pl-layout">
        {/* Sidebar */}
        <aside>
          <FilterSidebar
            categories={categories}
            currentCategory={params.category}
            currentMin={params.min}
            currentMax={params.max}
          />
        </aside>

        {/* Content */}
        <div>
          <div className="pl-topbar">
            <p className="pl-result-label">
              Showing <strong>{products.length}</strong> of{" "}
              <strong>{total}</strong> products
            </p>
            <SortDropdown currentSort={filters.sort} />
          </div>

          {/* Active filter chips */}
          {(params.category || params.min || params.max || params.search) && (
            <div className="pl-active-filters">
              {params.search && (
                <a href="/products" className="pl-filter-chip">
                  Search: {params.search} ✕
                </a>
              )}
              {params.category && (
                <a href="/products" className="pl-filter-chip">
                  {params.category} ✕
                </a>
              )}
              {(params.min || params.max) && (
                <a href="/products" className="pl-filter-chip">
                  ${params.min ?? "0"} – ${params.max ?? "∞"} ✕
                </a>
              )}
              <a href="/products" className="pl-clear-all">
                Clear all
              </a>
            </div>
          )}

          {/* Grid */}
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                {pages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={pages}
                    searchParams={params}
                  />
                )}
              </>
            ) : (
              <div className="pl-empty">
                <div className="pl-empty-icon">🔍</div>
                <h2 className="pl-empty-title">No products found</h2>
                <p className="pl-empty-sub">
                  Try adjusting your filters or search term.
                </p>
                <a href="/products" className="pl-empty-btn">
                  Clear filters
                </a>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
