import { requireAuth } from "@/lib/auth/helpers";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

        .al-hero {
          background: #0f172a;
          padding: 36px 48px;
          position: relative;
          overflow: hidden;
        }

        .al-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 50% 100% at 0% 50%, rgba(14,165,233,0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .al-hero-inner {
          max-width: 1100px; margin: 0 auto;
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 16px;
        }

        .al-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif;
          font-size: 20px; font-weight: 700; color: #fff;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.15);
        }

        .al-hero-text {}

        .al-hero-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
        }

        .al-hero-email {
          font-family: 'Sora', sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.45);
          font-weight: 300; margin-top: 2px;
        }

        .al-layout {
          max-width: 1100px; margin: 0 auto;
          padding: 36px 48px 80px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .al-hero { padding: 28px 20px; }
          .al-layout { grid-template-columns: 1fr; padding: 20px 16px 60px; gap: 20px; }
        }
      `}</style>

      {/* Hero bar */}
      <div className="al-hero">
        <div className="al-hero-inner">
          <div className="al-avatar">
            {user.name?.[0]?.toUpperCase() ??
              user.email?.[0]?.toUpperCase() ??
              "U"}
          </div>
          <div className="al-hero-text">
            <p className="al-hero-name">{user.name ?? "My Account"}</p>
            <p className="al-hero-email">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="al-layout">
        <AccountSidebar />
        <main>{children}</main>
      </div>
    </>
  );
}
