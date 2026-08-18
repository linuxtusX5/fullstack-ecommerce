"use client";

import { useState } from "react";
import { User, Mail, Lock, Check, Eye, EyeOff } from "lucide-react";

type Props = {
  user: { id: string; name: string; email: string };
};

export function ProfileForm({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPw.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err: any) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .pf-root { display: flex; flex-direction: column; gap: 24px; font-family: 'Sora', sans-serif; }

        .pf-card {
          background: #fff; border: 1px solid #f1f5f9;
          border-radius: 20px; overflow: hidden;
        }

        .pf-card-header {
          padding: 20px 24px; border-bottom: 1px solid #f8fafc;
          display: flex; align-items: center; gap: 10px;
        }

        .pf-card-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: #f0f9ff; color: #0ea5e9;
          display: flex; align-items: center; justify-content: center;
        }

        .pf-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .pf-card-sub   { font-size: 12px; color: #94a3b8; margin-top: 1px; }

        .pf-card-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

        /* Field */
        .pf-field { display: flex; flex-direction: column; gap: 6px; }

        .pf-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #94a3b8;
        }

        .pf-input-wrap { position: relative; }

        .pf-input {
          width: 100%; height: 44px;
          padding: 0 14px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; color: #0f172a;
          background: #f8fafc; outline: none;
          transition: all 0.2s; box-sizing: border-box;
        }

        .pf-input:focus {
          border-color: #0ea5e9; background: #fff;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }

        .pf-input-pw { padding-right: 44px; }

        .pf-pw-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 0;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .pf-pw-toggle:hover { color: #0ea5e9; }

        .pf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* Alert */
        .pf-alert {
          padding: 10px 14px; border-radius: 10px;
          font-size: 12px; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }
        .pf-alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }
        .pf-alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }

        /* Submit */
        .pf-submit {
          align-self: flex-start;
          height: 42px; padding: 0 24px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s;
        }
        .pf-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); }
        .pf-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .pf-submit-success { background: #16a34a !important; }

        .pf-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: pfSpin 0.7s linear infinite;
        }
        @keyframes pfSpin { to { transform: rotate(360deg); } }

        /* Danger zone */
        .pf-danger {
          background: #fff; border: 1px solid #fee2e2;
          border-radius: 20px; overflow: hidden;
        }
        .pf-danger-header { padding: 20px 24px; border-bottom: 1px solid #fee2e2; }
        .pf-danger-title  { font-size: 14px; font-weight: 700; color: #dc2626; }
        .pf-danger-body   { padding: 24px; }
        .pf-danger-sub    { font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.6; }
        .pf-danger-btn {
          height: 40px; padding: 0 20px;
          background: none; color: #dc2626;
          border: 1.5px solid #fecaca; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .pf-danger-btn:hover { background: #fef2f2; border-color: #ef4444; }

        @media (max-width: 640px) { .pf-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pf-root">
        {/* Profile info */}
        <div className="pf-card">
          <div className="pf-card-header">
            <div className="pf-card-icon">
              <User size={16} />
            </div>
            <div>
              <p className="pf-card-title">Personal Information</p>
              <p className="pf-card-sub">Update your name and email address</p>
            </div>
          </div>
          <form className="pf-card-body" onSubmit={handleProfileSave}>
            {profileSaved && (
              <div className="pf-alert pf-alert-success">
                <Check size={14} /> Profile updated successfully.
              </div>
            )}
            {profileError && (
              <div className="pf-alert pf-alert-error">⚠ {profileError}</div>
            )}

            <div className="pf-field">
              <label className="pf-label">Full name</label>
              <input
                className="pf-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="pf-field">
              <label className="pf-label">Email address</label>
              <input
                className="pf-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className={`pf-submit ${profileSaved ? "pf-submit-success" : ""}`}
              disabled={profileSaving}
            >
              {profileSaving ? (
                <span className="pf-spinner" />
              ) : profileSaved ? (
                <>
                  <Check size={14} /> Saved!
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="pf-card">
          <div className="pf-card-header">
            <div className="pf-card-icon">
              <Lock size={16} />
            </div>
            <div>
              <p className="pf-card-title">Change Password</p>
              <p className="pf-card-sub">
                Use a strong password of at least 8 characters
              </p>
            </div>
          </div>
          <form className="pf-card-body" onSubmit={handlePasswordSave}>
            {pwSaved && (
              <div className="pf-alert pf-alert-success">
                <Check size={14} /> Password updated successfully.
              </div>
            )}
            {pwError && (
              <div className="pf-alert pf-alert-error">⚠ {pwError}</div>
            )}

            <div className="pf-field">
              <label className="pf-label">Current password</label>
              <div className="pf-input-wrap">
                <input
                  className="pf-input pf-input-pw"
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="pf-pw-toggle"
                  onClick={() => setShowCurrent((v) => !v)}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pf-row">
              <div className="pf-field">
                <label className="pf-label">New password</label>
                <div className="pf-input-wrap">
                  <input
                    className="pf-input pf-input-pw"
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="pf-pw-toggle"
                    onClick={() => setShowNew((v) => !v)}
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pf-field">
                <label className="pf-label">Confirm new password</label>
                <input
                  className="pf-input"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`pf-submit ${pwSaved ? "pf-submit-success" : ""}`}
              disabled={pwSaving}
            >
              {pwSaving ? (
                <span className="pf-spinner" />
              ) : pwSaved ? (
                <>
                  <Check size={14} /> Updated!
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="pf-danger">
          <div className="pf-danger-header">
            <p className="pf-danger-title">Danger Zone</p>
          </div>
          <div className="pf-danger-body">
            <p className="pf-danger-sub">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button className="pf-danger-btn">Delete my account</button>
          </div>
        </div>
      </div>
    </>
  );
}
