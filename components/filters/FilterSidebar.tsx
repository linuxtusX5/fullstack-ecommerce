"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
};

type Props = {
  categories: Category[];
  currentCategory?: string;
  currentMin?: string;
  currentMax?: string;
};

const PRICE_RANGES = [
  { label: "Under $50", min: "0", max: "50" },
  { label: "$50 – $100", min: "50", max: "100" },
  { label: "$100 – $200", min: "100", max: "200" },
  { label: "$200 – $500", min: "200", max: "500" },
  { label: "Over $500", min: "500", max: "" },
];

export function FilterSidebar({
  categories,
  currentCategory,
  currentMin,
  currentMax,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [minVal, setMinVal] = useState(currentMin ?? "");
  const [maxVal, setMaxVal] = useState(currentMax ?? "");

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceRange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("min", min);
    else params.delete("min");
    if (max) params.set("max", max);
    else params.delete("max");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    handlePriceRange(minVal, maxVal);
  };

  const clearAll = () => {
    setMinVal("");
    setMaxVal("");
    router.push(pathname);
  };

  const hasFilters = currentCategory || currentMin || currentMax;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        .fs-root {
          font-family: 'Sora', sans-serif;
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          position: sticky;
          top: 88px;
        }

        .fs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .fs-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.01em;
        }

        .fs-clear {
          font-size: 11px;
          font-weight: 600;
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          padding: 0;
          transition: opacity 0.2s;
        }

        .fs-clear:hover { opacity: 0.7; }

        /* Section */
        .fs-section { border-bottom: 1px solid #f1f5f9; }
        .fs-section:last-child { border-bottom: none; }

        .fs-section-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: background 0.15s;
        }

        .fs-section-btn:hover { background: #f8fafc; }

        .fs-chevron {
          transition: transform 0.2s;
          color: #94a3b8;
        }

        .fs-chevron-open { transform: rotate(180deg); }

        .fs-section-body {
          padding: 4px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* Category items */
        .fs-cat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          font-family: 'Sora', sans-serif;
          text-align: left;
        }

        .fs-cat-item:hover { background: #f8fafc; }

        .fs-cat-item-active {
          background: #f0f9ff;
        }

        .fs-cat-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .fs-cat-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #e2e8f0;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .fs-cat-item-active .fs-cat-dot { background: #0ea5e9; }

        .fs-cat-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          transition: color 0.15s;
        }

        .fs-cat-item-active .fs-cat-name { color: #0284c7; font-weight: 600; }

        .fs-cat-count {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 2px 7px;
          border-radius: 100px;
        }

        .fs-cat-item-active .fs-cat-count {
          background: #e0f2fe;
          color: #0284c7;
        }

        /* All categories item */
        .fs-cat-all {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          padding: 8px 10px;
          border-radius: 9px;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'Sora', sans-serif;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .fs-cat-all:hover { background: #f8fafc; }

        .fs-cat-all-active { color: #0284c7; background: #f0f9ff; }

        /* Price range presets */
        .fs-price-preset {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 9px;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          text-align: left;
          transition: all 0.15s;
        }

        .fs-price-preset:hover { background: #f8fafc; }

        .fs-price-preset-active {
          background: #f0f9ff;
          color: #0284c7;
          font-weight: 600;
        }

        .fs-price-radio {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .fs-price-preset-active .fs-price-radio {
          border-color: #0ea5e9;
          background: #0ea5e9;
          box-shadow: inset 0 0 0 3px #fff;
        }

        /* Custom price */
        .fs-custom-price {
          margin-top: 10px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .fs-custom-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .fs-price-inputs {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .fs-price-input {
          flex: 1;
          height: 36px;
          padding: 0 10px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
        }

        .fs-price-input:focus {
          border-color: #0ea5e9;
          background: #fff;
          box-shadow: 0 0 0 2px rgba(14,165,233,0.1);
        }

        .fs-price-sep {
          font-size: 11px;
          color: #94a3b8;
          flex-shrink: 0;
        }

        .fs-price-apply {
          margin-top: 8px;
          width: 100%;
          height: 34px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fs-price-apply:hover { background: #1e293b; }
      `}</style>

      <div className="fs-root">
        <div className="fs-header">
          <span className="fs-title">
            <SlidersHorizontal size={14} />
            Filters
          </span>
          {hasFilters && (
            <button className="fs-clear" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="fs-section">
          <button
            className="fs-section-btn"
            onClick={() => setCatOpen((v) => !v)}
          >
            Category
            <ChevronDown
              size={14}
              className={`fs-chevron ${catOpen ? "fs-chevron-open" : ""}`}
            />
          </button>

          {catOpen && (
            <div className="fs-section-body">
              <button
                className={`fs-cat-all ${!currentCategory ? "fs-cat-all-active" : ""}`}
                onClick={() => updateParam("category", null)}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`fs-cat-item ${currentCategory === cat.slug ? "fs-cat-item-active" : ""}`}
                  onClick={() => updateParam("category", cat.slug)}
                >
                  <span className="fs-cat-left">
                    <span className="fs-cat-dot" />
                    <span className="fs-cat-name">{cat.name}</span>
                  </span>
                  <span className="fs-cat-count">{cat._count.products}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="fs-section">
          <button
            className="fs-section-btn"
            onClick={() => setPriceOpen((v) => !v)}
          >
            Price
            <ChevronDown
              size={14}
              className={`fs-chevron ${priceOpen ? "fs-chevron-open" : ""}`}
            />
          </button>

          {priceOpen && (
            <div className="fs-section-body">
              {PRICE_RANGES.map((range) => {
                const isActive =
                  currentMin === range.min && currentMax === range.max;
                return (
                  <button
                    key={range.label}
                    className={`fs-price-preset ${isActive ? "fs-price-preset-active" : ""}`}
                    onClick={() => handlePriceRange(range.min, range.max)}
                  >
                    <span className="fs-price-radio" />
                    {range.label}
                  </button>
                );
              })}

              {/* Custom range */}
              <div className="fs-custom-price">
                <p className="fs-custom-label">Custom range</p>
                <form onSubmit={handleCustomPrice}>
                  <div className="fs-price-inputs">
                    <input
                      className="fs-price-input"
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={minVal}
                      onChange={(e) => setMinVal(e.target.value)}
                    />
                    <span className="fs-price-sep">–</span>
                    <input
                      className="fs-price-input"
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={maxVal}
                      onChange={(e) => setMaxVal(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="fs-price-apply">
                    Apply
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
