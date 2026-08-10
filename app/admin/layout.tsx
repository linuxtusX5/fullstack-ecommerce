import { requireAdmin } from "@/lib/auth/helpers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .al-root {
          display: flex; min-height: 100vh;
          background: #0a0f1a;
          font-family: 'Sora', sans-serif;
        }

        .al-main {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
        }

        .al-topbar {
          height: 56px; border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center;
          padding: 0 28px; gap: 12px;
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }

        .al-topbar-title {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.04em;
        }

        .al-topbar-sep { color: rgba(255,255,255,0.15); }

        .al-topbar-page {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .al-content { flex: 1; padding: 32px 28px; overflow-y: auto; }

        @media (max-width: 768px) {
          .al-content { padding: 20px 16px; }
        }
      `}</style>

      <div className="al-root">
        <AdminSidebar />
        <div className="al-main">
          <div className="al-content">{children}</div>
        </div>
      </div>
    </>
  );
}