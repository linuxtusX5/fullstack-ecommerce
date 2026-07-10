import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type Props = {
  children: ReactNode;
  badge?: string;
  title?: string;
  subtitle?: string;
};

export function AuthCard({
  children,
  badge = "New platform",
  title = "Create your\nAccount",
  subtitle = "Share your artwork\nand Get projects!",
}: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .auth-page {
          min-height: 100vh;
          background: #0d1f2d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .auth-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 15% 50%, rgba(0,150,180,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0,80,120,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .auth-card {
          width: 100%;
          max-width: 880px;
          min-height: 560px;
          border-radius: 24px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
          position: relative;
          z-index: 1;
          animation: authCardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes authCardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .auth-left {
          flex: 0 0 42%;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          margin: 6px;
        }

        .auth-left-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(160deg, rgba(0,40,80,0.72) 0%, rgba(0,0,0,0.28) 50%, rgba(0,30,60,0.55) 100%),
            url('/default.jpg') center/cover no-repeat;
          border-radius: 16px;
        }

        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(44px);
          opacity: 0.38;
          animation: authOrbFloat 7s ease-in-out infinite;
          pointer-events: none;
        }
        .auth-orb-1 { width:200px;height:200px;background:radial-gradient(circle,#00b4d8,#0077b6);top:-50px;right:-50px; }
        .auth-orb-2 { width:140px;height:140px;background:radial-gradient(circle,#48cae4,#023e8a);bottom:50px;left:-24px;animation-delay:-3.5s; }
        .auth-orb-3 { width:90px;height:90px;background:radial-gradient(circle,#ade8f4,#0096c7);top:40%;right:20px;animation-delay:-1.8s; }

        @keyframes authOrbFloat {
          0%,100% { transform:translateY(0) scale(1); }
          50%      { transform:translateY(-22px) scale(1.04); }
        }

        .auth-left-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 30px;
        }

        .auth-left-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .auth-left-logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00d4ff;
          box-shadow: 0 0 10px rgba(0,212,255,0.8);
        }

        .auth-left-logo-name {
          font-size: 15px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.02em;
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 10.5px;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
          width: fit-content;
        }

        .auth-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00d4ff;
          box-shadow: 0 0 6px rgba(0,212,255,0.9);
          animation: authPulse 2s ease-in-out infinite;
        }

        @keyframes authPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(0.85); }
        }

        .auth-left-title {
          font-size: clamp(24px, 3.2vw, 32px);
          font-weight: 700;
          color: #fff;
          line-height: 1.18;
          margin-bottom: 12px;
          letter-spacing: -0.025em;
          white-space: pre-line;
        }

        .auth-left-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.52);
          line-height: 1.7;
          font-weight: 300;
          white-space: pre-line;
        }

        .auth-right {
          flex: 1;
          background: #fff;
          padding: 44px 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          animation: authRightIn 0.7s 0.12s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes authRightIn {
          from { opacity:0; transform:translateX(22px); }
          to   { opacity:1; transform:translateX(0); }
        }

        @media (max-width: 680px) {
          .auth-card  { flex-direction:column; max-width:440px; min-height:unset; }
          .auth-left  { flex:0 0 170px; margin:6px 6px 0; }
          .auth-right { padding:30px 26px 36px; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-left-bg" />
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />
            <div className="auth-left-content">
              <Link href="/" className="auth-left-logo">
                <span className="auth-left-logo-dot" />
                <span className="auth-left-logo-name">{siteConfig.name}</span>
              </Link>
              <div>
                <div className="auth-badge">
                  <span className="auth-badge-dot" />
                  {badge}
                </div>
                <h2 className="auth-left-title">{title}</h2>
                <p className="auth-left-sub">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="auth-right">{children}</div>
        </div>
      </div>
    </>
  );
}
