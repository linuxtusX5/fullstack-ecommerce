"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Tag,
  ImagePlus,
  Loader2,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  _count: { products: number };
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
.acc-root { font-family: 'Sora', sans-serif; color: #fff; max-width: 720px; }
.acc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.acc-title { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.acc-count { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.acc-add-btn { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.acc-add-btn:hover { background: #0284c7; }
.acc-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.acc-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.acc-item { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.acc-item:last-child { border-bottom: none; }
.acc-item:hover { background: rgba(255,255,255,0.02); }
.acc-cat-img { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.06); flex-shrink: 0; }
.acc-cat-img img { width: 100%; height: 100%; object-fit: cover; }
.acc-cat-no-img { width: 44px; height: 44px; border-radius: 10px; background: rgba(14,165,233,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.acc-name { font-size: 14px; font-weight: 600; color: #fff; }
.acc-slug { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
.acc-products { margin-left: auto; font-size: 12px; color: rgba(255,255,255,0.4); white-space: nowrap; }
.acc-actions { display: flex; gap: 6px; }
.acc-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); transition: all 0.15s; }
.acc-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.acc-btn-danger:hover { border-color: rgba(239,68,68,0.4); color: #ef4444; background: rgba(239,68,68,0.08); }
.acc-empty { text-align: center; padding: 48px 24px; color: rgba(255,255,255,0.3); font-size: 14px; }

/* Modal */
.acc-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: accFade 0.2s ease; }
.acc-modal { background: #0d1425; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 460px; animation: accSlide 0.3s cubic-bezier(0.22,1,0.36,1); }
.acc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.acc-modal-title { font-size: 15px; font-weight: 700; color: #fff; }
.acc-modal-close { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all 0.2s; }
.acc-modal-close:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.acc-form { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.acc-field { display: flex; flex-direction: column; gap: 6px; }
.acc-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
.acc-input { height: 42px; padding: 0 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #fff; background: rgba(255,255,255,0.06); outline: none; transition: all 0.2s; box-sizing: border-box; width: 100%; }
.acc-input:focus { border-color: #0ea5e9; background: rgba(255,255,255,0.08); }
.acc-error { padding: 10px 14px; border-radius: 9px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); font-size: 12px; color: #f87171; }
.acc-submit-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
.acc-cancel { height: 40px; padding: 0 20px; background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; }
.acc-cancel:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.acc-save { height: 40px; padding: 0 24px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
.acc-save:hover:not(:disabled) { background: #0284c7; }
.acc-save:disabled { opacity: 0.6; cursor: not-allowed; }
.acc-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: accSpin 0.7s linear infinite; }

/* Image upload */
.acc-img-upload { border: 2px dashed rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden; cursor: pointer; transition: border-color 0.2s; }
.acc-img-upload:hover { border-color: #0ea5e9; }
.acc-img-preview { width: 100%; height: 140px; object-fit: cover; display: block; }
.acc-img-placeholder { height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.acc-img-placeholder-text { font-size: 12px; color: rgba(255,255,255,0.3); }

@keyframes accFade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes accSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes accSpin  { to { transform: rotate(360deg); } }
`;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type ModalState = {
  id: string | null;
  name: string;
  slug: string;
  image: string;
};

export function AdminCategoriesClient({
  categories: initial,
}: {
  categories: Category[];
}) {
  const [categories, setCategories] = useState(initial);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => setModal({ id: null, name: "", slug: "", image: "" });
  const openEdit = (c: Category) =>
    setModal({ id: c.id, name: c.name, slug: c.slug, image: c.image ?? "" });
  const close = () => {
    setModal(null);
    setError("");
  };

  const setName = (name: string) =>
    setModal((m) => (m ? { ...m, name, slug: slugify(name) } : m));
  const setSlug = (slug: string) => setModal((m) => (m ? { ...m, slug } : m));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const data = await res.json();
      setModal((m) => (m ? { ...m, image: data.url } : m));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!modal?.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const url = modal.id
        ? `/api/admin/categories/${modal.id}`
        : "/api/admin/categories";
      const method = modal.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: modal.name,
          slug: modal.slug,
          image: modal.image || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data: Category = await res.json();
      if (modal.id) {
        setCategories((prev) =>
          prev.map((c) => (c.id === modal.id ? { ...c, ...data } : c)),
        );
      } else {
        setCategories((prev) => [
          ...prev,
          { ...data, _count: { products: 0 } },
        ]);
      }
      close();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat && cat._count.products > 0) {
      alert("Cannot delete a category that has products.");
      return;
    }
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="acc-root">
        <div className="acc-header">
          <div>
            <h1 className="acc-title">Categories</h1>
            <p className="acc-count">{categories.length} categories</p>
          </div>
          <button className="acc-add-btn" onClick={openAdd}>
            <Plus size={13} /> Add category
          </button>
        </div>

        <div className="acc-panel">
          {categories.length === 0 && (
            <div className="acc-empty">No categories yet. Add one!</div>
          )}
          {categories.map((cat) => (
            <div key={cat.id} className="acc-item">
              {cat.image ? (
                <div className="acc-cat-img">
                  <img src={cat.image} alt={cat.name} />
                </div>
              ) : (
                <div className="acc-cat-no-img">
                  <Tag size={16} color="#0ea5e9" />
                </div>
              )}
              <div>
                <p className="acc-name">{cat.name}</p>
                <p className="acc-slug">{cat.slug}</p>
              </div>
              <span className="acc-products">
                {cat._count.products} products
              </span>
              <div className="acc-actions">
                <button
                  className="acc-btn"
                  onClick={() => openEdit(cat)}
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="acc-btn acc-btn-danger"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleting === cat.id}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="acc-overlay"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="acc-modal">
            <div className="acc-modal-header">
              <p className="acc-modal-title">
                {modal.id ? "Edit category" : "Add category"}
              </p>
              <button className="acc-modal-close" onClick={close}>
                <X size={14} />
              </button>
            </div>
            <div className="acc-form">
              {error && <div className="acc-error">⚠ {error}</div>}

              <div className="acc-field">
                <label className="acc-label">Name</label>
                <input
                  className="acc-input"
                  value={modal.name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gadgets"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
              </div>

              <div className="acc-field">
                <label className="acc-label">Slug</label>
                <input
                  className="acc-input"
                  value={modal.slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. gadgets"
                />
              </div>

              <div className="acc-field">
                <label className="acc-label">Image</label>
                <div
                  className="acc-img-upload"
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? (
                    <div className="acc-img-placeholder">
                      <Loader2
                        size={20}
                        color="#0ea5e9"
                        style={{ animation: "accSpin 0.7s linear infinite" }}
                      />
                      <p className="acc-img-placeholder-text">Uploading…</p>
                    </div>
                  ) : modal.image ? (
                    <img
                      src={modal.image}
                      alt="Preview"
                      className="acc-img-preview"
                    />
                  ) : (
                    <div className="acc-img-placeholder">
                      <ImagePlus size={20} color="rgba(255,255,255,0.25)" />
                      <p className="acc-img-placeholder-text">
                        Click to upload image
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
                {modal.image && (
                  <button
                    type="button"
                    onClick={() =>
                      setModal((m) => (m ? { ...m, image: "" } : m))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: 11,
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "4px 0",
                    }}
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>

              <div className="acc-submit-row">
                <button className="acc-cancel" onClick={close}>
                  Cancel
                </button>
                <button
                  className="acc-save"
                  onClick={handleSave}
                  disabled={saving || uploading}
                >
                  {saving ? (
                    <span className="acc-spinner" />
                  ) : (
                    <>
                      <Check size={13} /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
