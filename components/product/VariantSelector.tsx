"use client";

import { useState, useEffect } from "react";

type Variant = {
  id: string;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  stock: number;
  price?: number | null;
};

type Props = {
  productId: string;
  basePrice: number;
  onVariantChange: (variant: Variant | null, price: number) => void;
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

.vs-root { font-family: 'Sora', sans-serif; display: flex; flex-direction: column; gap: 20px; }

.vs-section-label {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #94a3b8; margin-bottom: 10px;
}

/* Size options */
.vs-sizes { display: flex; flex-wrap: wrap; gap: 8px; }

.vs-size-btn {
  min-width: 48px; height: 40px; padding: 0 14px;
  border-radius: 9px; border: 1.5px solid #e2e8f0;
  background: #fff; font-family: 'Sora', sans-serif;
  font-size: 13px; font-weight: 500; color: #374151;
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.vs-size-btn:hover:not(:disabled) { border-color: #0f172a; color: #0f172a; }
.vs-size-btn-active { border-color: #0f172a !important; background: #0f172a !important; color: #fff !important; font-weight: 600 !important; }
.vs-size-btn:disabled { opacity: 0.35; cursor: not-allowed; text-decoration: line-through; }

/* Color options */
.vs-colors { display: flex; flex-wrap: wrap; gap: 8px; }

.vs-color-btn {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  transition: all 0.15s; position: relative;
  outline: none;
}
.vs-color-btn:hover:not(:disabled) { transform: scale(1.1); }
.vs-color-btn-active { border-color: #0f172a !important; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #0f172a; }
.vs-color-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.vs-color-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #64748b; margin-top: 8px;
}

/* Stock indicator */
.vs-stock {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 500; padding: 4px 10px;
  border-radius: 100px;
}
.vs-stock-in  { background: #f0fdf4; color: #16a34a; }
.vs-stock-low { background: #fff7ed; color: #ea580c; }
.vs-stock-out { background: #fef2f2; color: #dc2626; }
.vs-stock-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.vs-price-change {
  font-size: 13px; font-weight: 600; color: #0ea5e9;
  background: #f0f9ff; padding: 4px 10px; border-radius: 8px;
}

.vs-loading { font-size: 13px; color: #94a3b8; }
`;

export function VariantSelector({
  productId,
  basePrice,
  onVariantChange,
}: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/${productId}/variants`)
      .then((r) => r.json())
      .then((d) => {
        setVariants(d.variants ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  // Get unique sizes and colors
  const sizes = [
    ...new Set(variants.filter((v) => v.size).map((v) => v.size!)),
  ];
  const colors = [
    ...new Set(variants.filter((v) => v.color).map((v) => v.color!)),
  ];

  // Find matching variant
  const matchingVariant = variants.find((v) => {
    const sizeMatch = !sizes.length || v.size === selectedSize;
    const colorMatch = !colors.length || v.color === selectedColor;
    return sizeMatch && colorMatch;
  });

  useEffect(() => {
    if (matchingVariant) {
      onVariantChange(matchingVariant, matchingVariant.price ?? basePrice);
    } else {
      onVariantChange(null, basePrice);
    }
  }, [selectedSize, selectedColor, variants]);

  // Is a size available with current color selection?
  const isSizeAvailable = (size: string) => {
    return variants.some(
      (v) =>
        v.size === size &&
        (!selectedColor || v.color === selectedColor) &&
        v.stock > 0,
    );
  };

  // Is a color available with current size selection?
  const isColorAvailable = (color: string) => {
    return variants.some(
      (v) =>
        v.color === color &&
        (!selectedSize || v.size === selectedSize) &&
        v.stock > 0,
    );
  };

  const getColorHex = (color: string) => {
    return variants.find((v) => v.color === color)?.colorHex ?? "#e2e8f0";
  };

  if (loading) return <p className="vs-loading">Loading options…</p>;
  if (!variants.length) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="vs-root">
        {/* Size selector */}
        {sizes.length > 0 && (
          <div>
            <p className="vs-section-label">
              Size{" "}
              {selectedSize && (
                <span style={{ color: "#0f172a", fontWeight: 700 }}>
                  — {selectedSize}
                </span>
              )}
            </p>
            <div className="vs-sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`vs-size-btn ${selectedSize === size ? "vs-size-btn-active" : ""}`}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? null : size)
                  }
                  disabled={!isSizeAvailable(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color selector */}
        {colors.length > 0 && (
          <div>
            <p className="vs-section-label">
              Color{" "}
              {(hoveredColor || selectedColor) && (
                <span style={{ color: "#0f172a", fontWeight: 700 }}>
                  — {hoveredColor || selectedColor}
                </span>
              )}
            </p>
            <div className="vs-colors">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`vs-color-btn ${selectedColor === color ? "vs-color-btn-active" : ""}`}
                  style={{ background: getColorHex(color) }}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  disabled={!isColorAvailable(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stock + price for selected variant */}
        {matchingVariant && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              className={`vs-stock ${
                matchingVariant.stock === 0
                  ? "vs-stock-out"
                  : matchingVariant.stock <= 5
                    ? "vs-stock-low"
                    : "vs-stock-in"
              }`}
            >
              <span className="vs-stock-dot" />
              {matchingVariant.stock === 0
                ? "Out of stock"
                : matchingVariant.stock <= 5
                  ? `Only ${matchingVariant.stock} left`
                  : `${matchingVariant.stock} in stock`}
            </span>
            {matchingVariant.price && matchingVariant.price !== basePrice && (
              <span className="vs-price-change">
                ${matchingVariant.price.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
