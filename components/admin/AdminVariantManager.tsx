"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check, X, Pencil } from "lucide-react";

type Variant = {
  id: string;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  stock: number;
  price?: number | null;
};

type Props = { productId: string; basePrice: number };

const COMMON_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const COMMON_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Gray", hex: "#6b7280" },
  { name: "Brown", hex: "#92400e" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Orange", hex: "#f97316" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
.avm-root { font-family: 'Sora', sans-serif; }
.avm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.avm-title { font-size: 13px; font-weight: 700; color: #fff; }
.avm-add-btn { display: flex; align-items: center; gap: 5px; height: 30px; padding: 0 12px; background: rgba(14,165,233,0.15); border: 1px solid rgba(14,165,233,0.3); border-radius: 7px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #0ea5e9; cursor: pointer; transition: all 0.15s; }
.avm-add-btn:hover { background: rgba(14,165,233,0.25); }

/* Variant list */
.avm-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.avm-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
.avm-color-dot { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.2); flex-shrink: 0; }
.avm-item-size  { font-size: 12px; font-weight: 700; color: #fff; min-width: 32px; }
.avm-item-color { font-size: 12px; color: rgba(255,255,255,0.6); }
.avm-item-stock { font-size: 11px; font-weight: 600; margin-left: auto; padding: 2px 8px; border-radius: 100px; }
.avm-item-price { font-size: 12px; font-weight: 600; color: #0ea5e9; }
.avm-item-actions { display: flex; gap: 4px; }
.avm-item-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); transition: all 0.15s; }
.avm-item-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.avm-item-btn-danger:hover { border-color: rgba(239,68,68,0.4); color: #ef4444; background: rgba(239,68,68,0.08); }

/* Form */
.avm-form { background: rgba(14,165,233,0.05); border: 1px solid rgba(14,165,233,0.2); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.avm-form-title { font-size: 12px; font-weight: 700; color: #0ea5e9; margin-bottom: 4px; }
.avm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.avm-form-field { display: flex; flex-direction: column; gap: 5px; }
.avm-form-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
.avm-form-input { height: 36px; padding: 0 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; font-family: 'Sora', sans-serif; font-size: 12px; color: #fff; background: rgba(255,255,255,0.06); outline: none; transition: border-color 0.2s; box-sizing: border-box; width: 100%; }
.avm-form-input:focus { border-color: #0ea5e9; }
.avm-form-select { height: 36px; padding: 0 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; font-family: 'Sora', sans-serif; font-size: 12px; color: #fff; background: rgba(255,255,255,0.06); outline: none; cursor: pointer; width: 100%; }
.avm-form-select option { background: #1e293b; }

/* Color picker */
.avm-color-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.avm-color-chip { width: 24px; height: 24px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: all 0.15s; }
.avm-color-chip:hover { transform: scale(1.15); }
.avm-color-chip-active { border-color: #fff !important; box-shadow: 0 0 0 2px #0ea5e9; }

.avm-form-actions { display: flex; gap: 8px; justify-content: flex-end; }
.avm-save-btn { height: 32px; padding: 0 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 7px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background 0.2s; }
.avm-save-btn:hover { background: #0284c7; }
.avm-cancel-btn { height: 32px; padding: 0 14px; background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; font-family: 'Sora', sans-serif; font-size: 12px; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; }
.avm-cancel-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.avm-empty { font-size: 12px; color: rgba(255,255,255,0.3); text-align: center; padding: 16px 0; }
`;

type FormState = {
  size: string;
  color: string;
  colorHex: string;
  stock: string;
  price: string;
};
const EMPTY: FormState = {
  size: "",
  color: "",
  colorHex: "",
  stock: "0",
  price: "",
};

export function AdminVariantManager({ productId, basePrice }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Variant | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchVariants = async () => {
    const res = await fetch(`/api/admin/products/${productId}/variants`);
    const data = await res.json();
    setVariants(data.variants ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (v: Variant) => {
    setEditing(v);
    setForm({
      size: v.size ?? "",
      color: v.color ?? "",
      colorHex: v.colorHex ?? "",
      stock: String(v.stock),
      price: v.price ? String(v.price) : "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        size: form.size || null,
        color: form.color || null,
        colorHex: form.colorHex || null,
        stock: Number(form.stock),
        price: form.price ? Number(form.price) : null,
      };
      const url = editing
        ? `/api/admin/products/${productId}/variants/${editing.id}`
        : `/api/admin/products/${productId}/variants`;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      await fetchVariants();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/products/${productId}/variants/${id}`, {
        method: "DELETE",
      });
      setVariants((prev) => prev.filter((v) => v.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const selectColor = (name: string, hex: string) => {
    setForm((f) => ({ ...f, color: name, colorHex: hex }));
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="avm-root">
        <div className="avm-header">
          <span className="avm-title">Variants ({variants.length})</span>
          {!showForm && (
            <button className="avm-add-btn" onClick={openAdd}>
              <Plus size={11} /> Add variant
            </button>
          )}
        </div>

        {/* Variant list */}
        {!loading && variants.length === 0 && !showForm && (
          <p className="avm-empty">
            No variants yet. Add size or color options.
          </p>
        )}

        <div className="avm-list">
          {variants.map((v) => (
            <div key={v.id} className="avm-item">
              {v.colorHex && (
                <div
                  className="avm-color-dot"
                  style={{ background: v.colorHex }}
                />
              )}
              {v.size && <span className="avm-item-size">{v.size}</span>}
              {v.color && <span className="avm-item-color">{v.color}</span>}
              {v.price && (
                <span className="avm-item-price">${v.price.toFixed(2)}</span>
              )}
              <span
                className={`avm-item-stock ${
                  v.stock === 0
                    ? "avm-stock-out"
                    : v.stock <= 5
                      ? "avm-stock-low"
                      : "avm-stock-ok"
                }`}
                style={{
                  color:
                    v.stock === 0
                      ? "#ef4444"
                      : v.stock <= 5
                        ? "#f59e0b"
                        : "#10b981",
                  background:
                    v.stock === 0
                      ? "rgba(239,68,68,0.12)"
                      : v.stock <= 5
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(16,185,129,0.12)",
                }}
              >
                {v.stock} units
              </span>
              <div className="avm-item-actions">
                <button className="avm-item-btn" onClick={() => openEdit(v)}>
                  <Pencil size={11} />
                </button>
                <button
                  className="avm-item-btn avm-item-btn-danger"
                  onClick={() => handleDelete(v.id)}
                  disabled={deleting === v.id}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="avm-form">
            <p className="avm-form-title">
              {editing ? "Edit variant" : "New variant"}
            </p>

            <div className="avm-form-row">
              <div className="avm-form-field">
                <label className="avm-form-label">Size</label>
                <select
                  className="avm-form-select"
                  value={form.size}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, size: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {COMMON_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="avm-form-field">
                <label className="avm-form-label">Custom size</label>
                <input
                  className="avm-form-input"
                  placeholder="e.g. 32x30"
                  value={form.size}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, size: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="avm-form-field">
              <label className="avm-form-label">Color</label>
              <div className="avm-color-grid">
                {COMMON_COLORS.map((c) => (
                  <div
                    key={c.name}
                    className={`avm-color-chip ${form.color === c.name ? "avm-color-chip-active" : ""}`}
                    style={{
                      background: c.hex,
                      border:
                        c.hex === "#ffffff"
                          ? "1.5px solid rgba(255,255,255,0.2)"
                          : "2px solid transparent",
                    }}
                    onClick={() => selectColor(c.name, c.hex)}
                    title={c.name}
                  />
                ))}
              </div>
              <input
                className="avm-form-input"
                style={{ marginTop: 8 }}
                placeholder="Custom color name"
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
              />
            </div>

            <div className="avm-form-row">
              <div className="avm-form-field">
                <label className="avm-form-label">Stock</label>
                <input
                  className="avm-form-input"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                />
              </div>
              <div className="avm-form-field">
                <label className="avm-form-label">Price (optional)</label>
                <input
                  className="avm-form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={`Default: $${basePrice}`}
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="avm-form-actions">
              <button
                className="avm-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="avm-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  "Saving…"
                ) : (
                  <>
                    <Check size={11} /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
