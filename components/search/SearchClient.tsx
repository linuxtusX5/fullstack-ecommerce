"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string };
};

const TRENDING = [
  "Women's jackets",
  "Accessories",
  "Sneakers",
  "Summer dresses",
  "Men's shirts",
];
const RECENT_KEY = "search-recent";
const MAX_RECENT = 6;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveRecent(q: string) {
  try {
    const prev = getRecent().filter((s) => s !== q);
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify([q, ...prev].slice(0, MAX_RECENT)),
    );
  } catch {}
}
function removeRecent(q: string) {
  try {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(getRecent().filter((s) => s !== q)),
    );
  } catch {}
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

.sp-page { background: #fafaf9; min-height: 100vh; font-family: 'Sora', sans-serif; }

.sp-hero {
  background: #0f172a; padding: 48px 24px 56px;
  position: relative; overflow: hidden;
}
.sp-hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 80% at 50% 100%, rgba(14,165,233,0.12) 0%, transparent 60%);
  pointer-events: none;
}
.sp-hero-inner {
  max-width: 680px; margin: 0 auto;
  position: relative; z-index: 1; text-align: center;
}
.sp-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 5vw, 44px); font-weight: 700;
  color: #fff; letter-spacing: -0.02em; margin-bottom: 28px;
}
.sp-hero-title span { color: #0ea5e9; font-style: italic; }

.sp-bar-wrap { position: relative; }
.sp-bar {
  display: flex; align-items: center;
  background: #fff; border-radius: 16px;
  box-shadow: 0 20px 48px rgba(0,0,0,0.25);
  overflow: hidden; border: 2px solid transparent; transition: border-color 0.2s;
}
.sp-bar:focus-within { border-color: #0ea5e9; }
.sp-bar-icon { padding: 0 16px; color: #94a3b8; flex-shrink: 0; display: flex; align-items: center; }
.sp-bar-input {
  flex: 1; height: 58px; border: none; outline: none;
  font-family: 'Sora', sans-serif; font-size: 16px; color: #0f172a; background: transparent;
}
.sp-bar-input::placeholder { color: #cbd5e1; }
.sp-bar-clear {
  width: 36px; height: 36px; margin-right: 4px;
  border-radius: 50%; border: none; background: #f1f5f9;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #64748b; transition: all 0.15s; flex-shrink: 0;
}
.sp-bar-clear:hover { background: #e2e8f0; color: #0f172a; }
.sp-bar-btn {
  height: 58px; padding: 0 24px;
  background: #0ea5e9; color: #fff; border: none;
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.sp-bar-btn:hover { background: #0284c7; }

.sp-suggestions {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0;
  background: #fff; border-radius: 14px;
  box-shadow: 0 16px 48px rgba(15,23,42,0.18);
  border: 1px solid #f1f5f9; z-index: 50; overflow: hidden;
  animation: spFadeDown 0.15s ease;
}
.sp-suggestion-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; cursor: pointer; text-decoration: none; color: inherit;
  transition: background 0.1s;
}
.sp-suggestion-item:hover { background: #f8fafc; }
.sp-suggestion-img { width: 40px; height: 48px; border-radius: 8px; overflow: hidden; background: #f1f5f9; flex-shrink: 0; }
.sp-suggestion-img img { width: 100%; height: 100%; object-fit: cover; }
.sp-suggestion-name { font-size: 13px; font-weight: 600; color: #0f172a; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-suggestion-cat  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.sp-suggestion-price { font-size: 13px; font-weight: 700; color: #0f172a; flex-shrink: 0; }
.sp-suggestion-more {
  display: block; padding: 12px 16px; text-align: center;
  font-size: 12px; font-weight: 600; color: #0ea5e9;
  border-top: 1px solid #f1f5f9; text-decoration: none; transition: background 0.1s;
}
.sp-suggestion-more:hover { background: #f0f9ff; }

.sp-body { max-width: 1100px; margin: 0 auto; padding: 40px 48px 80px; }

.sp-discovery { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 48px; }
.sp-disc-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 18px; padding: 22px; }
.sp-disc-header { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
.sp-disc-icon { color: #0ea5e9; }
.sp-disc-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 0; border-bottom: 1px solid #f8fafc;
  cursor: pointer; transition: all 0.15s;
}
.sp-disc-item:last-child { border-bottom: none; }
.sp-disc-item:hover .sp-disc-item-text { color: #0ea5e9; }
.sp-disc-item-left { display: flex; align-items: center; gap: 10px; }
.sp-disc-item-text { font-size: 13px; font-weight: 500; color: #374151; transition: color 0.15s; }
.sp-disc-item-remove { background: none; border: none; cursor: pointer; color: #cbd5e1; padding: 4px; transition: color 0.15s; display: flex; align-items: center; }
.sp-disc-item-remove:hover { color: #ef4444; }
.sp-disc-empty { font-size: 13px; color: #cbd5e1; font-weight: 300; padding: 8px 0; }

.sp-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.sp-results-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
.sp-results-title span { color: #0ea5e9; }
.sp-results-count { font-size: 13px; color: #94a3b8; }
.sp-filter-link {
  display: flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 16px;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 9px;
  text-decoration: none; font-size: 12px; font-weight: 600; color: #374151; transition: all 0.2s;
}
.sp-filter-link:hover { border-color: #0ea5e9; color: #0ea5e9; }

.sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.sp-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; transition: all 0.2s; animation: spFadeUp 0.3s ease both; }
.sp-card:hover { box-shadow: 0 8px 28px rgba(15,23,42,0.09); transform: translateY(-2px); }
.sp-card-img { width: 100%; padding-top: 120%; position: relative; background: #f8fafc; overflow: hidden; }
.sp-card-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.sp-card:hover .sp-card-img img { transform: scale(1.04); }
.sp-card-body { padding: 14px; }
.sp-card-cat { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
.sp-card-name { font-size: 13px; font-weight: 600; color: #0f172a; text-decoration: none; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.2s; }
.sp-card-name:hover { color: #0ea5e9; }
.sp-card-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
.sp-card-price { font-size: 15px; font-weight: 700; color: #0f172a; }
.sp-card-btn { width: 32px; height: 32px; border-radius: 8px; background: #0f172a; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; transition: all 0.2s; }
.sp-card-btn:hover { background: #1e293b; transform: scale(1.05); }
.sp-card-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.sp-empty { text-align: center; padding: 64px 24px; grid-column: 1 / -1; }
.sp-empty-icon { width: 64px; height: 64px; border-radius: 50%; background: #f8fafc; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
.sp-empty-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
.sp-empty-sub   { font-size: 14px; color: #94a3b8; font-weight: 300; }
.sp-empty-btn   { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; height: 44px; padding: 0 24px; background: #0f172a; color: #fff; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; border-radius: 10px; text-decoration: none; transition: all 0.2s; }
.sp-empty-btn:hover { background: #1e293b; }

.sp-loading { width: 32px; height: 32px; border: 3px solid #f1f5f9; border-top-color: #0ea5e9; border-radius: 50%; animation: spSpin 0.7s linear infinite; margin: 48px auto; }

@keyframes spFadeUp   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spFadeDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spSpin     { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .sp-body { padding: 24px 16px 60px; }
  .sp-discovery { grid-template-columns: 1fr; }
  .sp-hero { padding: 36px 16px 44px; }
  .sp-bar-btn span { display: none; }
}
`;

function highlight(text: string, q: string) {
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{ background: "#fef08a", borderRadius: 2, padding: "0 1px" }}
      >
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [inputVal, setInputVal] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const inputRef = useRef<HTMLInputElement>(null);
  const sugTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    setRecent(getRecent());
  }, []);

  // Full results on query change
  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`)
        .then((r) => r.json())
        .then((d) => {
          setResults(d.products ?? []);
          setTotal(d.total ?? 0);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleInputChange = (val: string) => {
    setInputVal(val);
    clearTimeout(sugTimer.current);
    if (val.length < 2) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    sugTimer.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(val)}&limit=5`)
        .then((r) => r.json())
        .then((d) => {
          setSuggestions(d.products ?? []);
          setShowSug(true);
        });
    }, 200);
  };

  const handleSearch = (q: string = inputVal) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    saveRecent(trimmed);
    setRecent(getRecent());
    setQuery(trimmed);
    setInputVal(trimmed);
    setShowSug(false);
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
      scroll: false,
    });
  };

  const handleRemoveRecent = (q: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeRecent(q);
    setRecent(getRecent());
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images,
      stock: product.stock,
      category: product.category,
    });
    openCart();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="sp-page" onClick={() => setShowSug(false)}>
        {/* Hero */}
        <div className="sp-hero" onClick={(e) => e.stopPropagation()}>
          <div className="sp-hero-inner">
            <h1 className="sp-hero-title">
              Find what you <span>love</span>
            </h1>
            <div className="sp-bar-wrap">
              <div className="sp-bar">
                <div className="sp-bar-icon">
                  <Search size={20} />
                </div>
                <input
                  ref={inputRef}
                  className="sp-bar-input"
                  placeholder="Search products, categories…"
                  value={inputVal}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                    if (e.key === "Escape") setShowSug(false);
                  }}
                  onFocus={() =>
                    inputVal.length >= 2 &&
                    suggestions.length > 0 &&
                    setShowSug(true)
                  }
                  autoComplete="off"
                />
                {inputVal && (
                  <button
                    className="sp-bar-clear"
                    onClick={() => {
                      setInputVal("");
                      setQuery("");
                      setSuggestions([]);
                      setShowSug(false);
                      inputRef.current?.focus();
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
                <button className="sp-bar-btn" onClick={() => handleSearch()}>
                  <Search size={15} /> <span>Search</span>
                </button>
              </div>

              {showSug && suggestions.length > 0 && (
                <div
                  className="sp-suggestions"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {suggestions.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="sp-suggestion-item"
                      onClick={() => {
                        saveRecent(inputVal);
                        setShowSug(false);
                      }}
                    >
                      <div className="sp-suggestion-img">
                        <img
                          src={p.images?.[0] ?? "/placeholder.jpg"}
                          alt={p.name}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="sp-suggestion-name">
                          {highlight(p.name, inputVal)}
                        </p>
                        <p className="sp-suggestion-cat">{p.category.name}</p>
                      </div>
                      <span className="sp-suggestion-price">
                        ${p.price.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                  <div
                    className="sp-suggestion-more"
                    onMouseDown={() => handleSearch()}
                    style={{ cursor: "pointer" }}
                  >
                    See all results for "{inputVal}" →
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sp-body">
          {/* Discovery state */}
          {!query && mounted && (
            <div className="sp-discovery">
              <div className="sp-disc-card">
                <div className="sp-disc-header">
                  <TrendingUp size={16} className="sp-disc-icon" /> Trending
                  searches
                </div>
                {TRENDING.map((t) => (
                  <div
                    key={t}
                    className="sp-disc-item"
                    onClick={() => handleSearch(t)}
                  >
                    <div className="sp-disc-item-left">
                      <TrendingUp size={13} color="#0ea5e9" />
                      <span className="sp-disc-item-text">{t}</span>
                    </div>
                    <ArrowRight size={13} color="#cbd5e1" />
                  </div>
                ))}
              </div>

              <div className="sp-disc-card">
                <div className="sp-disc-header">
                  <Clock size={16} className="sp-disc-icon" /> Recent searches
                </div>
                {recent.length === 0 ? (
                  <p className="sp-disc-empty">No recent searches yet.</p>
                ) : (
                  recent.map((r) => (
                    <div
                      key={r}
                      className="sp-disc-item"
                      onClick={() => handleSearch(r)}
                    >
                      <div className="sp-disc-item-left">
                        <Clock size={13} color="#94a3b8" />
                        <span className="sp-disc-item-text">{r}</span>
                      </div>
                      <button
                        className="sp-disc-item-remove"
                        onClick={(e) => handleRemoveRecent(r, e)}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {query && (
            <>
              <div className="sp-results-header">
                <div>
                  <h2 className="sp-results-title">
                    Results for <span>"{query}"</span>
                  </h2>
                  {!loading && (
                    <p className="sp-results-count">
                      {total} product{total !== 1 ? "s" : ""} found
                    </p>
                  )}
                </div>
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  className="sp-filter-link"
                >
                  <SlidersHorizontal size={13} /> Advanced filters
                </Link>
              </div>

              {loading ? (
                <div className="sp-loading" />
              ) : results.length === 0 ? (
                <div className="sp-empty">
                  <div className="sp-empty-icon">
                    <Search size={28} />
                  </div>
                  <p className="sp-empty-title">No results for "{query}"</p>
                  <p className="sp-empty-sub">
                    Try different keywords or browse all products.
                  </p>
                  <Link href="/products" className="sp-empty-btn">
                    Browse all products <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="sp-grid">
                  {results.map((product, i) => (
                    <div
                      key={product.id}
                      className="sp-card"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <Link href={`/products/${product.slug}`}>
                        <div className="sp-card-img">
                          <img
                            src={product.images?.[0] ?? "/placeholder.jpg"}
                            alt={product.name}
                          />
                        </div>
                      </Link>
                      <div className="sp-card-body">
                        <p className="sp-card-cat">{product.category.name}</p>
                        <Link
                          href={`/products/${product.slug}`}
                          className="sp-card-name"
                        >
                          {highlight(product.name, query)}
                        </Link>
                        <div className="sp-card-bottom">
                          <span className="sp-card-price">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            className="sp-card-btn"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock === 0}
                            aria-label="Add to cart"
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
