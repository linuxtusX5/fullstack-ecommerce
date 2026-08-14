import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500&display=swap');

        .bc-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .bc-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
        }

        .bc-link {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.15s;
          white-space: nowrap;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bc-link:hover { color: #0ea5e9; }

        .bc-current {
          color: #374151;
          font-weight: 500;
          white-space: nowrap;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bc-sep { color: #cbd5e1; flex-shrink: 0; }
      `}</style>

      <nav aria-label="Breadcrumb" className="bc-nav">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="bc-item">
              {i > 0 && <ChevronRight size={12} className="bc-sep" />}
              {isLast || !item.href ? (
                <span className="bc-current" title={item.label}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="bc-link" title={item.label}>
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
