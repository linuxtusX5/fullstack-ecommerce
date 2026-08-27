"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Shield, User } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { orders: number; wishlistItems: number };
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
.auc-root { font-family: 'Sora', sans-serif; color: #fff; }
.auc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.auc-title { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
.auc-count { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.auc-search-wrap { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; }
.auc-search-input { background: none; border: none; outline: none; font-family: 'Sora', sans-serif; font-size: 12px; color: #fff; width: 200px; }
.auc-search-input::placeholder { color: rgba(255,255,255,0.3); }
.auc-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.auc-table { width: 100%; border-collapse: collapse; }
.auc-table th { padding: 11px 16px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
.auc-table td { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; vertical-align: middle; }
.auc-table tr:last-child td { border-bottom: none; }
.auc-table tr:hover td { background: rgba(255,255,255,0.02); }
.auc-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.auc-name { font-weight: 600; color: #fff; font-size: 13px; }
.auc-email { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.auc-date { font-size: 12px; color: rgba(255,255,255,0.4); white-space: nowrap; }
.auc-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.auc-badge-admin { color: #f59e0b; background: rgba(245,158,11,0.12); }
.auc-badge-user  { color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); }
.auc-stat { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }
.auc-role-select { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 5px 10px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; outline: none; transition: all 0.15s; }
.auc-role-select:hover { border-color: rgba(255,255,255,0.2); }
.auc-role-select option { background: #1e293b; color: #fff; }
.auc-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid rgba(255,255,255,0.06); }
.auc-page-info { font-size: 12px; color: rgba(255,255,255,0.4); }
.auc-page-btns { display: flex; gap: 6px; }
.auc-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: none; cursor: pointer; color: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.auc-page-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.2); color: #fff; }
.auc-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.auc-empty { text-align: center; padding: 64px 24px; color: rgba(255,255,255,0.3); font-size: 14px; }
`;

export function AdminUsersClient({
  users: initial,
  total,
  page,
  pages,
  query: initialQuery,
}: {
  users: UserRow[];
  total: number;
  page: number;
  pages: number;
  query: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState(initialQuery);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      search ? `/admin/users?q=${encodeURIComponent(search)}` : "/admin/users",
    );
  };

  const updateRole = async (userId: string, role: string) => {
    setUpdating(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auc-root">
        <div className="auc-header">
          <div>
            <h1 className="auc-title">Users</h1>
            <p className="auc-count">{total} total users</p>
          </div>
          <form onSubmit={handleSearch}>
            <div className="auc-search-wrap">
              <Search size={13} color="rgba(255,255,255,0.3)" />
              <input
                className="auc-search-input"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="auc-panel">
          {users.length === 0 ? (
            <div className="auc-empty">No users found.</div>
          ) : (
            <table className="auc-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Wishlist</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div className="auc-avatar">
                          {(u.name ?? u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="auc-name">{u.name ?? "—"}</p>
                          <p className="auc-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="auc-date">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span className="auc-stat">{u._count.orders}</span>
                    </td>
                    <td>
                      <span className="auc-stat">{u._count.wishlistItems}</span>
                    </td>
                    <td>
                      <select
                        className="auc-role-select"
                        value={u.role}
                        disabled={updating === u.id}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div className="auc-pagination">
              <span className="auc-page-info">
                Page {page} of {pages}
              </span>
              <div className="auc-page-btns">
                <button
                  className="auc-page-btn"
                  disabled={page <= 1}
                  onClick={() =>
                    router.push(
                      `/admin/users?page=${page - 1}${initialQuery ? `&q=${initialQuery}` : ""}`,
                    )
                  }
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="auc-page-btn"
                  disabled={page >= pages}
                  onClick={() =>
                    router.push(
                      `/admin/users?page=${page + 1}${initialQuery ? `&q=${initialQuery}` : ""}`,
                    )
                  }
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
