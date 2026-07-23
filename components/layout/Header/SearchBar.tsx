"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TRENDING = [
  "Running shoes",
  "Summer dress",
  "Leather bag",
  "Denim jacket",
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchBar({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Load recent searches from localStorage
      try {
        const stored = JSON.parse(
          localStorage.getItem("recentSearches") || "[]",
        );
        setRecentSearches(stored);
      } catch {}
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fetch results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
      .then((r) => r.json())
      .then((data) => setResults(data.products ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const saveSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      try {
        const updated = [
          term,
          ...recentSearches.filter((s) => s !== term),
        ].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        setRecentSearches(updated);
      } catch {}
    },
    [recentSearches],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearch(query);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
    onClose();
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .sb-overlay {
          position: fixed;
          inset: 0;
          z-index: 70;
          opacity: 0;
          visibility: hidden;
          transition: all 0.25s ease;
          font-family: 'Sora', sans-serif;
        }

        .sb-overlay-open {
          opacity: 1;
          visibility: visible;
        }

        .sb-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(6px);
        }

        .sb-panel {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: #fff;
          padding: 20px 24px 0;
          transform: translateY(-100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .sb-overlay-open .sb-panel {
          transform: translateY(0);
        }

        .sb-top {
          max-width: 720px;
          margin: 0 auto;
        }

        /* Search input */
        .sb-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid #0ea5e9;
          border-radius: 14px;
          padding: 0 16px;
          height: 54px;
          background: #f8fafc;
          transition: all 0.2s;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.1);
        }

        .sb-input-wrap:focus-within {
          background: #fff;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.15);
        }

        .sb-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #0f172a;
        }

        .sb-input::placeholder { color: #94a3b8; font-weight: 400; }

        .sb-clear {
          width: 28px; height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          border: none;
          background: #e2e8f0;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .sb-clear:hover { background: #cbd5e1; color: #0f172a; }

        .sb-close {
          padding: 6px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          background: none;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sb-close:hover { background: #f1f5f9; color: #0f172a; }

        /* Body */
        .sb-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 20px 0 24px;
        }

        .sb-section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        /* Chips */
        .sb-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sb-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 100px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .sb-chip:hover {
          border-color: #0ea5e9;
          background: #f0f9ff;
          color: #0284c7;
        }

        /* Results list */
        .sb-result-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.15s;
          margin-bottom: 2px;
        }

        .sb-result-item:hover { background: #f8fafc; }

        .sb-result-img {
          width: 52px; height: 52px;
          border-radius: 10px;
          background: #f1f5f9;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }

        .sb-result-name {
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          line-height: 1.3;
        }

        .sb-result-meta {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 3px;
        }

        .sb-result-price {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-left: auto;
          flex-shrink: 0;
        }

        /* View all */
        .sb-view-all {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
          padding: 11px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .sb-view-all:hover {
          border-color: #0ea5e9;
          color: #0284c7;
          background: #f0f9ff;
        }

        .sb-empty {
          text-align: center;
          padding: 32px 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .sb-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 0;
          color: #94a3b8;
        }
      `}</style>

      <div
        className={`sb-overlay ${isOpen ? "sb-overlay-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="sb-backdrop" onClick={onClose} />

        <div className="sb-panel">
          <div className="sb-top">
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <div className="sb-input-wrap" style={{ flex: 1 }}>
                <Search size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  className="sb-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    className="sb-clear"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <button type="button" className="sb-close" onClick={onClose}>
                Cancel
              </button>
            </form>

            <div className="sb-body">
              {/* Loading */}
              {loading && (
                <div className="sb-loading">
                  <Loader2
                    size={20}
                    style={{ animation: "spin 0.7s linear infinite" }}
                  />
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <>
                  <p className="sb-section-label">
                    <Search size={12} /> Results
                  </p>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="sb-result-item"
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                    >
                      <div className="sb-result-img">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="52px"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="sb-result-name">{product.name}</p>
                        <p className="sb-result-meta">
                          {product.category.name}
                        </p>
                      </div>
                      <span className="sb-result-price">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="sb-view-all"
                    onClick={onClose}
                  >
                    View all results for &ldquo;{query}&rdquo;
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}

              {/* No results */}
              {!loading && query && results.length === 0 && (
                <div className="sb-empty">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {/* Empty state — trending + recent */}
              {!query && (
                <>
                  {recentSearches.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <p className="sb-section-label">
                        <Clock size={12} /> Recent
                      </p>
                      <div className="sb-chips">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            className="sb-chip"
                            onClick={() => handleTrendingClick(term)}
                          >
                            <Clock size={12} />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="sb-section-label">
                      <TrendingUp size={12} /> Trending
                    </p>
                    <div className="sb-chips">
                      {TRENDING.map((term) => (
                        <button
                          key={term}
                          className="sb-chip"
                          onClick={() => handleTrendingClick(term)}
                        >
                          <TrendingUp size={12} />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
