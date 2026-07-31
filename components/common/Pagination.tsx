import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function buildHref(
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v && k !== "page") params.set(k, v);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export function Pagination({ currentPage, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;

  // Build page numbers to show: always first, last, current ±2
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pages.add(i);
  }
  const pageList = Array.from(pages).sort((a, b) => a - b);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600&display=swap');

        .pag-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #f1f5f9;
          font-family: 'Sora', sans-serif;
        }

        .pag-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s;
        }

        .pag-btn:hover:not(.pag-btn-disabled) {
          border-color: #0ea5e9;
          color: #0ea5e9;
          background: #f0f9ff;
        }

        .pag-btn-active {
          background: #0f172a;
          border-color: #0f172a;
          color: #fff !important;
          font-weight: 700;
        }

        .pag-btn-active:hover { background: #1e293b !important; border-color: #1e293b !important; }

        .pag-btn-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }

        .pag-ellipsis {
          width: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 13px;
          user-select: none;
        }
      `}</style>

      <nav className="pag-wrap" aria-label="Pagination">
        {/* Prev */}
        <Link
          href={buildHref(searchParams, currentPage - 1)}
          className={`pag-btn ${currentPage === 1 ? "pag-btn-disabled" : ""}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </Link>

        {/* Pages */}
        {pageList.map((p, i) => {
          const prev = pageList[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <>
              {showEllipsis && (
                <span key={`ellipsis-${p}`} className="pag-ellipsis">
                  …
                </span>
              )}
              <Link
                key={p}
                href={buildHref(searchParams, p)}
                className={`pag-btn ${p === currentPage ? "pag-btn-active" : ""}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </Link>
            </>
          );
        })}

        {/* Next */}
        <Link
          href={buildHref(searchParams, currentPage + 1)}
          className={`pag-btn ${currentPage === totalPages ? "pag-btn-disabled" : ""}`}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </Link>
      </nav>
    </>
  );
}
