"use client";

import { useState } from "react";
import { Plus, MapPin, Pencil, Trash2, Star, Check, X } from "lucide-react";

type Address = {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
};

type FormData = Omit<Address, "id" | "isDefault"> & { isDefault: boolean };

const EMPTY_FORM: FormData = {
  label: "Home",
  firstName: "",
  lastName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  phone: "",
  isDefault: false,
};

const LABEL_OPTIONS = ["Home", "Work", "Other"];

export function AddressesPanel({
  addresses: initial,
}: {
  addresses: Address[];
}) {
  const [addresses, setAddresses] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone ?? "",
      isDefault: addr.isDefault,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setError("");
  };

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing
        ? `/api/account/addresses/${editing.id}`
        : "/api/account/addresses";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();

      if (editing) {
        setAddresses((prev) =>
          prev
            .map((a) => {
              if (form.isDefault)
                return { ...a, isDefault: a.id === editing.id };
              return a.id === editing.id ? data : a;
            })
            .map((a) => (a.id === editing.id ? data : a)),
        );
      } else {
        if (data.isDefault) {
          setAddresses((prev) => [
            ...prev.map((a) => ({ ...a, isDefault: false })),
            data,
          ]);
        } else {
          setAddresses((prev) => [...prev, data]);
        }
      }
      closeForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/account/addresses/${id}/default`, { method: "PATCH" });
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .ap-root { font-family: 'Sora', sans-serif; }

        /* Header row */
        .ap-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .ap-title { font-size: 14px; font-weight: 700; color: #0f172a; }

        .ap-add-btn {
          display: flex; align-items: center; gap: 6px;
          height: 38px; padding: 0 16px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .ap-add-btn:hover { background: #1e293b; }

        /* Grid */
        .ap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        /* Address card */
        .ap-card {
          background: #fff; border: 1.5px solid #f1f5f9;
          border-radius: 16px; padding: 18px;
          position: relative; transition: all 0.2s;
          animation: apFadeUp 0.3s ease both;
        }
        .ap-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(15,23,42,0.06); }
        .ap-card-default { border-color: #bae6fd; background: #f0f9ff; }

        .ap-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 10px;
        }

        .ap-label-row { display: flex; align-items: center; gap: 6px; }

        .ap-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #64748b;
        }

        .ap-default-badge {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 2px 7px; border-radius: 100px;
          background: #0ea5e9; color: #fff;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .ap-card-actions { display: flex; gap: 4px; }

        .ap-action-btn {
          width: 28px; height: 28px; border-radius: 7px;
          background: none; border: 1px solid #f1f5f9;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #94a3b8;
          transition: all 0.15s;
        }
        .ap-action-btn:hover { border-color: #e2e8f0; color: #374151; }
        .ap-action-btn-danger:hover { border-color: #fecaca; color: #ef4444; background: #fef2f2; }
        .ap-action-btn-star:hover  { border-color: #fde68a; color: #d97706; background: #fffbeb; }
        .ap-action-btn-star-active { border-color: #fde68a; color: #d97706; background: #fffbeb; }

        .ap-name {
          font-size: 14px; font-weight: 600; color: #0f172a;
          margin-bottom: 4px;
        }

        .ap-address {
          font-size: 12px; color: #64748b; line-height: 1.7;
          font-weight: 300;
        }

        .ap-phone { font-size: 12px; color: #94a3b8; margin-top: 6px; }

        /* Empty */
        .ap-empty {
          background: #fff; border: 1.5px dashed #e2e8f0;
          border-radius: 16px; padding: 48px 24px;
          text-align: center;
        }
        .ap-empty-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: #f8fafc; margin: 0 auto 12px;
          display: flex; align-items: center; justify-content: center;
          color: #cbd5e1;
        }
        .ap-empty-title { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .ap-empty-sub   { font-size: 13px; color: #94a3b8; font-weight: 300; }

        /* Form overlay */
        .ap-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(15,23,42,0.4);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: apFadeIn 0.2s ease;
        }

        .ap-modal {
          background: #fff; border-radius: 20px;
          width: 100%; max-width: 520px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 64px rgba(15,23,42,0.2);
          animation: apSlideUp 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        .ap-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid #f1f5f9;
          position: sticky; top: 0; background: #fff; z-index: 1;
        }
        .ap-modal-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .ap-modal-close {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #e2e8f0; background: none;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #64748b; transition: all 0.2s;
        }
        .ap-modal-close:hover { border-color: #0f172a; color: #0f172a; }

        .ap-form { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

        /* Form fields */
        .ap-field { display: flex; flex-direction: column; gap: 6px; }
        .ap-label-text {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #94a3b8;
        }
        .ap-input {
          height: 42px; padding: 0 12px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; color: #0f172a;
          background: #f8fafc; outline: none;
          transition: all 0.2s; box-sizing: border-box; width: 100%;
        }
        .ap-input:focus { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }

        .ap-select {
          height: 42px; padding: 0 12px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; color: #0f172a;
          background: #f8fafc; outline: none;
          transition: all 0.2s; box-sizing: border-box; width: 100%;
          cursor: pointer;
        }
        .ap-select:focus { border-color: #0ea5e9; background: #fff; }

        .ap-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ap-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

        /* Label chips */
        .ap-chips { display: flex; gap: 8px; }
        .ap-chip {
          height: 34px; padding: 0 16px;
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          background: none; cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 500; color: #64748b;
          transition: all 0.15s;
        }
        .ap-chip:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .ap-chip-active { border-color: #0ea5e9; background: #f0f9ff; color: #0284c7; font-weight: 600; }

        /* Checkbox */
        .ap-checkbox-row {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; background: #f8fafc;
          border-radius: 10px; cursor: pointer;
        }
        .ap-checkbox {
          width: 18px; height: 18px;
          border: 1.5px solid #e2e8f0; border-radius: 5px;
          background: #fff; display: flex; align-items: center;
          justify-content: center; transition: all 0.15s; flex-shrink: 0;
        }
        .ap-checkbox-checked { background: #0ea5e9; border-color: #0ea5e9; }
        .ap-checkbox-label { font-size: 13px; font-weight: 500; color: #374151; }

        /* Alert */
        .ap-error {
          padding: 10px 14px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          font-size: 12px; color: #b91c1c;
        }

        /* Submit */
        .ap-submit-row { display: flex; gap: 10px; justify-content: flex-end; }
        .ap-cancel-btn {
          height: 42px; padding: 0 20px;
          background: none; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600; color: #64748b;
          cursor: pointer; transition: all 0.2s;
        }
        .ap-cancel-btn:hover { border-color: #0f172a; color: #0f172a; }
        .ap-save-btn {
          height: 42px; padding: 0 28px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: all 0.2s;
        }
        .ap-save-btn:hover:not(:disabled) { background: #1e293b; }
        .ap-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ap-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: apSpin 0.7s linear infinite;
        }

        @keyframes apFadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes apFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes apSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes apSpin    { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ap-root">
        <div className="ap-header">
          <p className="ap-title">Saved Addresses</p>
          <button className="ap-add-btn" onClick={openAdd}>
            <Plus size={13} /> Add address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="ap-empty">
            <div className="ap-empty-icon">
              <MapPin size={22} />
            </div>
            <p className="ap-empty-title">No addresses saved</p>
            <p className="ap-empty-sub">Add an address for faster checkout.</p>
          </div>
        ) : (
          <div className="ap-grid">
            {addresses.map((addr, i) => (
              <div
                key={addr.id}
                className={`ap-card ${addr.isDefault ? "ap-card-default" : ""}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="ap-card-top">
                  <div className="ap-label-row">
                    <span className="ap-label">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="ap-default-badge">
                        <Check size={8} /> Default
                      </span>
                    )}
                  </div>
                  <div className="ap-card-actions">
                    {!addr.isDefault && (
                      <button
                        className="ap-action-btn ap-action-btn-star"
                        onClick={() => handleSetDefault(addr.id)}
                        title="Set as default"
                      >
                        <Star size={12} />
                      </button>
                    )}
                    <button
                      className="ap-action-btn"
                      onClick={() => openEdit(addr)}
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className="ap-action-btn ap-action-btn-danger"
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleting === addr.id}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <p className="ap-name">
                  {addr.firstName} {addr.lastName}
                </p>
                <p className="ap-address">
                  {addr.line1}
                  <br />
                  {addr.line2 && (
                    <>
                      {addr.line2}
                      <br />
                    </>
                  )}
                  {addr.city}, {addr.state} {addr.postalCode}
                  <br />
                  {addr.country}
                </p>
                {addr.phone && <p className="ap-phone">{addr.phone}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div
          className="ap-overlay"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="ap-modal">
            <div className="ap-modal-header">
              <p className="ap-modal-title">
                {editing ? "Edit address" : "Add new address"}
              </p>
              <button className="ap-modal-close" onClick={closeForm}>
                <X size={14} />
              </button>
            </div>

            <form className="ap-form" onSubmit={handleSubmit}>
              {error && <div className="ap-error">⚠ {error}</div>}

              {/* Label chips */}
              <div className="ap-field">
                <span className="ap-label-text">Label</span>
                <div className="ap-chips">
                  {LABEL_OPTIONS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={`ap-chip ${form.label === l ? "ap-chip-active" : ""}`}
                      onClick={() => set("label", l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="ap-row">
                <div className="ap-field">
                  <label className="ap-label-text">First name</label>
                  <input
                    className="ap-input"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="ap-field">
                  <label className="ap-label-text">Last name</label>
                  <input
                    className="ap-input"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Address lines */}
              <div className="ap-field">
                <label className="ap-label-text">Address line 1</label>
                <input
                  className="ap-input"
                  value={form.line1}
                  onChange={(e) => set("line1", e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="ap-field">
                <label className="ap-label-text">
                  Address line 2{" "}
                  <span style={{ color: "#cbd5e1" }}>(optional)</span>
                </label>
                <input
                  className="ap-input"
                  value={form.line2 ?? ""}
                  onChange={(e) => set("line2", e.target.value)}
                  placeholder="Apt, suite, etc."
                />
              </div>

              {/* City / State / Postal */}
              <div className="ap-row-3">
                <div className="ap-field">
                  <label className="ap-label-text">City</label>
                  <input
                    className="ap-input"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    required
                  />
                </div>
                <div className="ap-field">
                  <label className="ap-label-text">State</label>
                  <input
                    className="ap-input"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    required
                  />
                </div>
                <div className="ap-field">
                  <label className="ap-label-text">Postal code</label>
                  <input
                    className="ap-input"
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Country / Phone */}
              <div className="ap-row">
                <div className="ap-field">
                  <label className="ap-label-text">Country</label>
                  <select
                    className="ap-select"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="PH">Philippines</option>
                    <option value="SG">Singapore</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
                <div className="ap-field">
                  <label className="ap-label-text">
                    Phone <span style={{ color: "#cbd5e1" }}>(optional)</span>
                  </label>
                  <input
                    className="ap-input"
                    value={form.phone ?? ""}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+1 555 000 0000"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <div
                className="ap-checkbox-row"
                onClick={() => set("isDefault", !form.isDefault)}
              >
                <div
                  className={`ap-checkbox ${form.isDefault ? "ap-checkbox-checked" : ""}`}
                >
                  {form.isDefault && <Check size={11} color="#fff" />}
                </div>
                <span className="ap-checkbox-label">
                  Set as default address
                </span>
              </div>

              <div className="ap-submit-row">
                <button
                  type="button"
                  className="ap-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="ap-save-btn" disabled={saving}>
                  {saving ? (
                    <span className="ap-spinner" />
                  ) : (
                    <>
                      <Check size={14} /> Save address
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
