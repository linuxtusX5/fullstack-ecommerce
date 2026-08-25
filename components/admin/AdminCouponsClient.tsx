"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Check,
  Tag,
  ToggleLeft,
  ToggleRight,
  Pencil,
} from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder?: number | null;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: Date | string | null;
  active: boolean;
  createdAt: Date | string;
  _count: { orders: number };
};

type FormData = {
  code: string;
  type: string;
  value: string;
  minOrder: string;
  maxUses: string;
  expiresAt: string;
  active: boolean;
};

const EMPTY: FormData = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minOrder: "",
  maxUses: "",
  expiresAt: "",
  active: true,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
.acp-root { font-family: 'Sora', sans-serif; color: #fff; }
.acp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.acp-title { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.acp-count { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.acp-add-btn { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.acp-add-btn:hover { background: #0284c7; }

.acp-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.acp-table { width: 100%; border-collapse: collapse; }
.acp-table th { padding: 11px 16px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
.acp-table td { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; vertical-align: middle; }
.acp-table tr:last-child td { border-bottom: none; }
.acp-table tr:hover td { background: rgba(255,255,255,0.02); }

.acp-code { font-family: monospace; font-size: 13px; font-weight: 700; color: #0ea5e9; background: rgba(14,165,233,0.1); padding: 3px 10px; border-radius: 6px; letter-spacing: 0.05em; }
.acp-type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.acp-type-pct   { color: #8b5cf6; background: rgba(139,92,246,0.12); }
.acp-type-fixed { color: #0ea5e9; background: rgba(14,165,233,0.12); }
.acp-value { font-weight: 700; color: #fff; }
.acp-usage { font-size: 12px; color: rgba(255,255,255,0.5); }
.acp-expires { font-size: 11px; color: rgba(255,255,255,0.4); }
.acp-expired { color: #ef4444; }
.acp-actions { display: flex; gap: 6px; }
.acp-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); transition: all 0.15s; }
.acp-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.acp-btn-danger:hover { border-color: rgba(239,68,68,0.4); color: #ef4444; background: rgba(239,68,68,0.08); }
.acp-empty { text-align: center; padding: 48px 24px; color: rgba(255,255,255,0.3); font-size: 14px; }

/* Modal */
.acp-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: acpFade 0.2s ease; }
.acp-modal { background: #0d1425; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: acpSlide 0.3s cubic-bezier(0.22,1,0.36,1); }
.acp-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; background: #0d1425; z-index: 1; }
.acp-modal-title { font-size: 15px; font-weight: 700; color: #fff; }
.acp-modal-close { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all 0.2s; }
.acp-modal-close:hover { color: #fff; }
.acp-form { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.acp-field { display: flex; flex-direction: column; gap: 6px; }
.acp-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
.acp-input { height: 42px; padding: 0 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #fff; background: rgba(255,255,255,0.06); outline: none; transition: all 0.2s; box-sizing: border-box; width: 100%; }
.acp-input:focus { border-color: #0ea5e9; background: rgba(255,255,255,0.08); }
.acp-select { height: 42px; padding: 0 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #fff; background: rgba(255,255,255,0.06); outline: none; cursor: pointer; width: 100%; }
.acp-select option { background: #1e293b; }
.acp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.acp-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.04); border-radius: 9px; border: 1px solid rgba(255,255,255,0.08); }
.acp-toggle-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); }
.acp-toggle-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); transition: color 0.2s; display: flex; }
.acp-toggle-btn-on { color: #0ea5e9; }
.acp-error { padding: 10px 14px; border-radius: 9px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); font-size: 12px; color: #f87171; }
.acp-submit-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
.acp-cancel { height: 40px; padding: 0 20px; background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; }
.acp-cancel:hover { color: #fff; }
.acp-save { height: 40px; padding: 0 24px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
.acp-save:hover:not(:disabled) { background: #0284c7; }
.acp-save:disabled { opacity: 0.6; cursor: not-allowed; }
.acp-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: acpSpin 0.7s linear infinite; }
@keyframes acpFade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes acpSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes acpSpin  { to { transform: rotate(360deg); } }
`;

function isExpired(date?: Date | string | null) {
  if (!date) return false;
  return new Date(date) < new Date();
}

export function AdminCouponsClient({
  coupons: initial,
}: {
  coupons: Coupon[];
}) {
  const [coupons, setCoupons] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const set = (k: keyof FormData, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setShowForm(true);
  };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrder: c.minOrder ? String(c.minOrder) : "",
      maxUses: c.maxUses ? String(c.maxUses) : "",
      expiresAt: c.expiresAt
        ? new Date(c.expiresAt).toISOString().slice(0, 10)
        : "",
      active: c.active,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrder: form.minOrder ? Number(form.minOrder) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
        active: form.active,
      };
      const url = editing
        ? `/api/admin/coupons/${editing.id}`
        : "/api/admin/coupons";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      if (editing) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)),
        );
      } else {
        setCoupons((prev) => [{ ...data, _count: { orders: 0 } }, ...prev]);
      }
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    if (res.ok) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c)),
      );
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="acp-root">
        <div className="acp-header">
          <div>
            <h1 className="acp-title">Coupons</h1>
            <p className="acp-count">{coupons.length} coupons</p>
          </div>
          <button className="acp-add-btn" onClick={openAdd}>
            <Plus size={13} /> Create coupon
          </button>
        </div>

        <div className="acp-panel">
          {coupons.length === 0 ? (
            <div className="acp-empty">
              No coupons yet. Create your first one!
            </div>
          ) : (
            <table className="acp-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Usage</th>
                  <th>Expires</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="acp-code">{c.code}</span>
                    </td>
                    <td>
                      <span
                        className={`acp-type-badge ${c.type === "PERCENTAGE" ? "acp-type-pct" : "acp-type-fixed"}`}
                      >
                        <Tag size={9} />
                        {c.type === "PERCENTAGE" ? "%" : "$"}
                      </span>
                    </td>
                    <td className="acp-value">
                      {c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}
                      {c.minOrder && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            marginLeft: 6,
                          }}
                        >
                          min ${c.minOrder}
                        </span>
                      )}
                    </td>
                    <td className="acp-usage">
                      {c.usedCount}
                      {c.maxUses ? `/${c.maxUses}` : ""} uses
                    </td>
                    <td>
                      {c.expiresAt ? (
                        <span
                          className={`acp-expires ${isExpired(c.expiresAt) ? "acp-expired" : ""}`}
                        >
                          {isExpired(c.expiresAt)
                            ? "Expired"
                            : new Date(c.expiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.2)",
                          }}
                        >
                          Never
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="acp-toggle-btn"
                        onClick={() => toggleActive(c)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {c.active ? (
                          <ToggleRight size={22} color="#0ea5e9" />
                        ) : (
                          <ToggleLeft size={22} color="rgba(255,255,255,0.2)" />
                        )}
                      </button>
                    </td>
                    <td>
                      <div className="acp-actions">
                        <button
                          className="acp-btn"
                          onClick={() => openEdit(c)}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="acp-btn acp-btn-danger"
                          onClick={() => handleDelete(c.id)}
                          disabled={deleting === c.id}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="acp-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="acp-modal">
            <div className="acp-modal-header">
              <p className="acp-modal-title">
                {editing ? "Edit coupon" : "Create coupon"}
              </p>
              <button
                className="acp-modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={14} />
              </button>
            </div>
            <form className="acp-form" onSubmit={handleSubmit}>
              {error && <div className="acp-error">⚠ {error}</div>}

              <div className="acp-field">
                <label className="acp-label">Coupon Code</label>
                <input
                  className="acp-input"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  required
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 700,
                  }}
                />
              </div>

              <div className="acp-row">
                <div className="acp-field">
                  <label className="acp-label">Type</label>
                  <select
                    className="acp-select"
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed amount ($)</option>
                  </select>
                </div>
                <div className="acp-field">
                  <label className="acp-label">
                    {form.type === "PERCENTAGE" ? "Discount %" : "Discount $"}
                  </label>
                  <input
                    className="acp-input"
                    type="number"
                    min="0"
                    max={form.type === "PERCENTAGE" ? "100" : undefined}
                    step="0.01"
                    value={form.value}
                    onChange={(e) => set("value", e.target.value)}
                    placeholder={
                      form.type === "PERCENTAGE" ? "e.g. 20" : "e.g. 10"
                    }
                    required
                  />
                </div>
              </div>

              <div className="acp-row">
                <div className="acp-field">
                  <label className="acp-label">Min. Order ($)</label>
                  <input
                    className="acp-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minOrder}
                    onChange={(e) => set("minOrder", e.target.value)}
                    placeholder="No minimum"
                  />
                </div>
                <div className="acp-field">
                  <label className="acp-label">Max Uses</label>
                  <input
                    className="acp-input"
                    type="number"
                    min="1"
                    value={form.maxUses}
                    onChange={(e) => set("maxUses", e.target.value)}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="acp-field">
                <label className="acp-label">Expiry Date</label>
                <input
                  className="acp-input"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => set("expiresAt", e.target.value)}
                />
              </div>

              <div className="acp-toggle-row">
                <span className="acp-toggle-label">Active</span>
                <button
                  type="button"
                  className={`acp-toggle-btn ${form.active ? "acp-toggle-btn-on" : ""}`}
                  onClick={() => set("active", !form.active)}
                >
                  {form.active ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </button>
              </div>

              <div className="acp-submit-row">
                <button
                  type="button"
                  className="acp-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="acp-save" disabled={saving}>
                  {saving ? (
                    <span className="acp-spinner" />
                  ) : (
                    <>
                      <Check size={13} /> Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
