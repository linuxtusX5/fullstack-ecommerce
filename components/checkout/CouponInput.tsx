"use client";

import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";

export type CouponResult = {
  id: string;
  code: string;
  type: string;
  value: number;
  discount: number;
};

type Props = {
  subtotal: number;
  onApply: (coupon: CouponResult) => void;
  onRemove: () => void;
  applied?: CouponResult | null;
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

.ci-root { font-family: 'Sora', sans-serif; }

.ci-label {
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: #64748b; margin-bottom: 8px; display: block;
}

.ci-row { display: flex; gap: 8px; }

.ci-input {
  flex: 1; height: 44px; padding: 0 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 13px;
  font-weight: 600; color: #0f172a; text-transform: uppercase;
  letter-spacing: 0.05em; outline: none; transition: all 0.2s;
  background: #fff;
}
.ci-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
.ci-input::placeholder { text-transform: none; font-weight: 400; letter-spacing: 0; color: #94a3b8; }

.ci-btn {
  height: 44px; padding: 0 18px;
  background: #0f172a; color: #fff; border: none;
  border-radius: 10px; font-family: 'Sora', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
}
.ci-btn:hover:not(:disabled) { background: #1e293b; }
.ci-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.ci-error {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #ef4444; margin-top: 8px;
  padding: 8px 12px; background: #fef2f2;
  border-radius: 8px; border: 1px solid #fee2e2;
}

.ci-applied {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; background: #f0fdf4;
  border: 1.5px solid #bbf7d0; border-radius: 10px;
}
.ci-applied-icon { width: 28px; height: 28px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ci-applied-code { font-size: 13px; font-weight: 700; color: #16a34a; letter-spacing: 0.05em; }
.ci-applied-desc { font-size: 11px; color: #4ade80; margin-top: 1px; }
.ci-applied-discount { margin-left: auto; font-size: 15px; font-weight: 700; color: #16a34a; flex-shrink: 0; }
.ci-applied-remove { width: 24px; height: 24px; border-radius: 50%; border: none; background: rgba(22,163,74,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; color: #16a34a; transition: all 0.15s; flex-shrink: 0; }
.ci-applied-remove:hover { background: rgba(22,163,74,0.25); }
`;

export function CouponInput({ subtotal, onApply, onRemove, applied }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid coupon");
      onApply(data);
      setCode("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <>
        <style>{CSS}</style>
        <div className="ci-root">
          <span className="ci-label">Coupon</span>
          <div className="ci-applied">
            <div className="ci-applied-icon">
              <Tag size={13} color="#16a34a" />
            </div>
            <div>
              <p className="ci-applied-code">{applied.code}</p>
              <p className="ci-applied-desc">
                {applied.type === "PERCENTAGE"
                  ? `${applied.value}% off`
                  : `$${applied.value} off`}
              </p>
            </div>
            <span className="ci-applied-discount">
              −${applied.discount.toFixed(2)}
            </span>
            <button className="ci-applied-remove" onClick={onRemove}>
              <X size={12} />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ci-root">
        <span className="ci-label">Coupon code</span>
        <div className="ci-row">
          <input
            className="ci-input"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
          <button
            className="ci-btn"
            onClick={handleApply}
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <Loader2
                size={14}
                style={{ animation: "spin 0.7s linear infinite" }}
              />
            ) : (
              <>
                <Tag size={13} /> Apply
              </>
            )}
          </button>
        </div>
        {error && <p className="ci-error">⚠ {error}</p>}
      </div>
    </>
  );
}
