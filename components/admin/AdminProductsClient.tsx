"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Upload,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { AdminVariantManager } from "@/components/admin/AdminVariantManager";
type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: Category;
  createdAt: Date;
};
type FormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
.apc-root { font-family: 'Sora', sans-serif; color: #fff; }
.apc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.apc-title { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.apc-count { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.apc-header-right { display: flex; gap: 10px; align-items: center; }
.apc-search-wrap { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; }
.apc-search-input { background: none; border: none; outline: none; font-family: 'Sora', sans-serif; font-size: 12px; color: #fff; width: 160px; }
.apc-search-input::placeholder { color: rgba(255,255,255,0.3); }
.apc-add-btn { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
.apc-add-btn:hover { background: #0284c7; }
.apc-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.apc-table { width: 100%; border-collapse: collapse; }
.apc-table th { padding: 11px 16px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
.apc-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; vertical-align: middle; }
.apc-table tr:last-child td { border-bottom: none; }
.apc-table tr:hover td { background: rgba(255,255,255,0.02); }
.apc-img { width: 40px; height: 48px; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,0.06); flex-shrink: 0; }
.apc-img img { width: 100%; height: 100%; object-fit: cover; }
.apc-name { font-weight: 600; color: #fff; }
.apc-slug { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
.apc-cat { display: inline-block; padding: 2px 9px; border-radius: 100px; background: rgba(255,255,255,0.08); font-size: 11px; color: rgba(255,255,255,0.6); }
.apc-price { font-weight: 700; color: #fff; }
.apc-stock-ok  { color: #10b981; font-weight: 600; }
.apc-stock-low { color: #f59e0b; font-weight: 600; }
.apc-stock-out { color: #ef4444; font-weight: 600; }
.apc-actions { display: flex; gap: 6px; }
.apc-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); transition: all 0.15s; }
.apc-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.apc-btn-danger:hover { border-color: rgba(239,68,68,0.4); color: #ef4444; background: rgba(239,68,68,0.08); }
.apc-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid rgba(255,255,255,0.06); }
.apc-page-info { font-size: 12px; color: rgba(255,255,255,0.4); }
.apc-page-btns { display: flex; gap: 6px; }
.apc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; color: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.apc-page-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.2); color: #fff; }
.apc-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.apc-empty { text-align: center; padding: 64px 24px; color: rgba(255,255,255,0.3); font-size: 14px; }

/* Modal */
.apc-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: apcFade 0.2s ease; }
.apc-modal { background: #0d1425; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; animation: apcSlide 0.3s cubic-bezier(0.22,1,0.36,1); }
.apc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; background: #0d1425; z-index: 1; }
.apc-modal-title { font-size: 15px; font-weight: 700; color: #fff; }
.apc-modal-close { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all 0.2s; }
.apc-modal-close:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.apc-form { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.apc-field { display: flex; flex-direction: column; gap: 6px; }
.apc-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
.apc-input { height: 42px; padding: 0 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #fff; background: rgba(255,255,255,0.06); outline: none; transition: all 0.2s; box-sizing: border-box; width: 100%; }
.apc-input:focus { border-color: #0ea5e9; background: rgba(255,255,255,0.08); }
.apc-textarea { min-height: 80px; padding: 10px 12px; resize: vertical; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #fff; background: rgba(255,255,255,0.06); outline: none; transition: all 0.2s; box-sizing: border-box; width: 100%; }
.apc-textarea:focus { border-color: #0ea5e9; }
.apc-select { height: 42px; padding: 0 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #fff; background: rgba(255,255,255,0.06); outline: none; cursor: pointer; width: 100%; }
.apc-select option { background: #1e293b; }
.apc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.apc-error { padding: 10px 14px; border-radius: 9px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); font-size: 12px; color: #f87171; }
.apc-submit-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
.apc-cancel { height: 40px; padding: 0 20px; background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; }
.apc-cancel:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.apc-save { height: 40px; padding: 0 24px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
.apc-save:hover:not(:disabled) { background: #0284c7; }
.apc-save:disabled { opacity: 0.6; cursor: not-allowed; }
.apc-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: apcSpin 0.7s linear infinite; }

/* Image upload */
.apc-upload-zone {
  border: 2px dashed rgba(255,255,255,0.12); border-radius: 12px;
  padding: 20px; text-align: center; cursor: pointer;
  transition: all 0.2s; position: relative;
}
.apc-upload-zone:hover, .apc-upload-zone-drag { border-color: #0ea5e9; background: rgba(14,165,233,0.05); }
.apc-upload-zone-text { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 8px; }
.apc-upload-zone-sub { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 4px; }
.apc-upload-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 16px; margin-top: 10px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; font-family: 'Sora', sans-serif;
  font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7);
  cursor: pointer; transition: all 0.2s;
}
.apc-upload-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

/* Image previews */
.apc-img-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.apc-img-thumb {
  position: relative; width: 72px; height: 86px;
  border-radius: 8px; overflow: hidden;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
}
.apc-img-thumb img { width: 100%; height: 100%; object-fit: cover; }
.apc-img-thumb-remove {
  position: absolute; top: 3px; right: 3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(0,0,0,0.7); border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #fff; transition: background 0.15s;
}
.apc-img-thumb-remove:hover { background: #ef4444; }
.apc-img-uploading {
  position: absolute; inset: 0;
  background: rgba(13,20,37,0.8);
  display: flex; align-items: center; justify-content: center;
}

@keyframes apcFade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes apcSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes apcSpin  { to { transform: rotate(360deg); } }
`;

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminProductsClient({
  products: initial,
  categories,
  total,
  page,
  pages,
  query: initialQuery,
}: {
  products: Product[];
  categories: Category[];
  total: number;
  page: number;
  pages: number;
  query: string;
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState(initialQuery);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "name") next.slug = slugify(v);
      return next;
    });
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: "",
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.category.id,
    });
    setImages(p.images ?? []);
    setError("");
    setShowForm(true);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const arr = Array.from(files);
    try {
      const urls = await Promise.all(
        arr.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd,
          });
          if (!res.ok)
            throw new Error((await res.json()).error ?? "Upload failed");
          const data = await res.json();
          return data.url as string;
        }),
      );
      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        images,
      };
      const url = editing
        ? `/api/admin/products/${editing.id}`
        : "/api/admin/products";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      if (editing) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p)),
        );
      } else {
        setProducts((prev) => [data, ...prev]);
      }
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      search
        ? `/admin/products?q=${encodeURIComponent(search)}`
        : "/admin/products",
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="apc-root">
        <div className="apc-header">
          <div>
            <h1 className="apc-title">Products</h1>
            <p className="apc-count">{total} total products</p>
          </div>
          <div className="apc-header-right">
            <form onSubmit={handleSearch}>
              <div className="apc-search-wrap">
                <Search size={13} color="rgba(255,255,255,0.3)" />
                <input
                  className="apc-search-input"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
            <button className="apc-add-btn" onClick={openAdd}>
              <Plus size={13} /> Add product
            </button>
          </div>
        </div>

        <div className="apc-panel">
          {products.length === 0 ? (
            <div className="apc-empty">No products found.</div>
          ) : (
            <table className="apc-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="apc-img">
                        <img
                          src={p.images?.[0] ?? "/placeholder.jpg"}
                          alt={p.name}
                        />
                      </div>
                    </td>
                    <td>
                      <p className="apc-name">{p.name}</p>
                      <p className="apc-slug">{p.slug}</p>
                    </td>
                    <td>
                      <span className="apc-cat">{p.category.name}</span>
                    </td>
                    <td className="apc-price">${p.price.toFixed(2)}</td>
                    <td>
                      <span
                        className={
                          p.stock === 0
                            ? "apc-stock-out"
                            : p.stock <= 5
                              ? "apc-stock-low"
                              : "apc-stock-ok"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <div className="apc-actions">
                        <button
                          className="apc-btn"
                          onClick={() => openEdit(p)}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="apc-btn apc-btn-danger"
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
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

          {pages > 1 && (
            <div className="apc-pagination">
              <span className="apc-page-info">
                Page {page} of {pages}
              </span>
              <div className="apc-page-btns">
                <button
                  className="apc-page-btn"
                  disabled={page <= 1}
                  onClick={() =>
                    router.push(`/admin/products?page=${page - 1}`)
                  }
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="apc-page-btn"
                  disabled={page >= pages}
                  onClick={() =>
                    router.push(`/admin/products?page=${page + 1}`)
                  }
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="apc-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="apc-modal">
            <div className="apc-modal-header">
              <p className="apc-modal-title">
                {editing ? "Edit product" : "Add new product"}
              </p>
              <button
                className="apc-modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={14} />
              </button>
            </div>
            <form className="apc-form" onSubmit={handleSubmit}>
              {error && <div className="apc-error">⚠ {error}</div>}
              <div className="apc-row">
                <div className="apc-field">
                  <label className="apc-label">Name</label>
                  <input
                    className="apc-input"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                  />
                </div>
                <div className="apc-field">
                  <label className="apc-label">Slug</label>
                  <input
                    className="apc-input"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="apc-field">
                <label className="apc-label">Description</label>
                <textarea
                  className="apc-textarea"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  required={!editing}
                />
              </div>
              <div className="apc-row">
                <div className="apc-field">
                  <label className="apc-label">Price ($)</label>
                  <input
                    className="apc-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    required
                  />
                </div>
                <div className="apc-field">
                  <label className="apc-label">Stock</label>
                  <input
                    className="apc-input"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="apc-field">
                <label className="apc-label">Category</label>
                <select
                  className="apc-select"
                  value={form.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                  required
                >
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image upload */}
              <div className="apc-field">
                <label className="apc-label">Images</label>

                {/* Drop zone */}
                <div
                  className={`apc-upload-zone ${drag ? "apc-upload-zone-drag" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2
                      size={24}
                      color="#0ea5e9"
                      style={{
                        animation: "apcSpin 0.7s linear infinite",
                        margin: "0 auto",
                      }}
                    />
                  ) : (
                    <>
                      <ImagePlus
                        size={24}
                        color="rgba(255,255,255,0.25)"
                        style={{ margin: "0 auto" }}
                      />
                      <p className="apc-upload-zone-text">
                        Drag & drop images here
                      </p>
                      <p className="apc-upload-zone-sub">
                        JPG, PNG, WebP · Max 5MB each
                      </p>
                      <button
                        type="button"
                        className="apc-upload-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileRef.current?.click();
                        }}
                      >
                        <Upload size={12} /> Choose files
                      </button>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileInput}
                  />
                </div>

                {/* Previews */}
                {images.length > 0 && (
                  <div className="apc-img-grid">
                    {images.map((url, i) => (
                      <div key={url} className="apc-img-thumb">
                        <img src={url} alt={`Image ${i + 1}`} />
                        <button
                          type="button"
                          className="apc-img-thumb-remove"
                          onClick={() => removeImage(i)}
                        >
                          <X size={10} />
                        </button>
                        {i === 0 && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 3,
                              left: 3,
                              background: "#0ea5e9",
                              borderRadius: 4,
                              padding: "1px 5px",
                              fontSize: 9,
                              fontWeight: 700,
                              color: "#fff",
                            }}
                          >
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* Variants */}
                {editing && (
                  <div className="apc-field">
                    <label className="apc-label">Variants</label>
                    <AdminVariantManager
                      productId={editing.id}
                      basePrice={Number(form.price) || editing.price}
                    />
                  </div>
                )}
              </div>

              <div className="apc-submit-row">
                <button
                  type="button"
                  className="apc-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apc-save"
                  disabled={saving || uploading}
                >
                  {saving ? (
                    <span className="apc-spinner" />
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
