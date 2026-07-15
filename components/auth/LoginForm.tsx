"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ERROR_MAP: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked: "This email is linked to a different sign-in method.",
  default: "Something went wrong. Please try again.",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const registered = searchParams.get("registered");
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(ERROR_MAP[res.error] ?? ERROR_MAP.default);
      setIsLoading(false);
    } else if (res?.ok) {
      // window.location.replace(callbackUrl);

      const session = await getSession();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setError(ERROR_MAP.default);
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
    setGoogleLoading(false);
  };

  const errorMessage =
    error ?? (authError ? (ERROR_MAP[authError] ?? ERROR_MAP.default) : null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .lf-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.03em;
          margin-bottom: 24px; text-align: center;
        }

        .lf-alert {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 10px 14px; border-radius: 10px;
          font-size: 12.5px; margin-bottom: 14px;
          font-family: 'Sora', sans-serif;
        }

        .lf-alert-error   { background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; }
        .lf-alert-success { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; }

        .lf-field {
          margin-bottom: 12px; position: relative;
          display: flex; flex-direction: column; gap: 4px;
        }

        .lf-input {
          width: 100%; height: 46px;
          padding: 0 42px 0 16px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-size: 13px;
          color: #0f172a; background: #f8fafc;
          outline: none; transition: all 0.2s;
          box-sizing: border-box;
        }

        .lf-input::placeholder { color: #94a3b8; }

        .lf-input:focus {
          border-color: #0ea5e9; background: #fff;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
        }

        .lf-input-err { border-color:#f87171!important; background:#fff5f5!important; }
        .lf-err-msg { font-size: 11px; color: #ef4444; font-family: 'Sora', sans-serif; }

        .lf-icon-btn {
          position: absolute; right: 14px; top: 13px;
          color: #94a3b8; cursor: pointer;
          display: flex; align-items: center;
          background: none; border: none; padding: 0;
          transition: color 0.2s;
        }
        .lf-icon-btn:hover { color: #0ea5e9; }

        .lf-forgot { display: flex; justify-content: flex-end; margin-bottom: 16px; }
        .lf-forgot a { font-size:12px; color:#0ea5e9; font-family:'Sora',sans-serif; text-decoration:none; font-weight:500; }
        .lf-forgot a:hover { text-decoration:underline; }

        .lf-btn-primary {
          width: 100%; height: 48px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }

        .lf-btn-primary:hover:not(:disabled) {
          background: #1e293b; transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(15,23,42,0.28);
        }

        .lf-btn-primary:disabled { opacity:0.6; cursor:not-allowed; }

        .lf-spinner {
          width:16px; height:16px;
          border:2px solid rgba(255,255,255,0.3);
          border-top-color:#fff; border-radius:50%;
          animation:lfSpin 0.7s linear infinite;
        }
        @keyframes lfSpin { to { transform:rotate(360deg); } }

        .lf-divider { display:flex; align-items:center; gap:12px; margin:16px 0; }
        .lf-divider::before,.lf-divider::after { content:''; flex:1; height:1px; background:#e2e8f0; }
        .lf-divider span { font-size:12px; color:#94a3b8; font-family:'Sora',sans-serif; }

        .lf-social-btn {
          width:100%; height:44px; border-radius:10px;
          font-family:'Sora',sans-serif; font-size:13px; font-weight:500;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          gap:10px; transition:all 0.2s; margin-bottom:10px;
        }

        .lf-btn-google { background:#fff; border:1.5px solid #e2e8f0; color:#374151; }
        .lf-btn-google:hover:not(:disabled) { border-color:#cbd5e1; background:#f8fafc; }
        .lf-btn-apple  { background:#0f172a; border:1.5px solid #0f172a; color:#fff; margin-bottom:0; }
        .lf-btn-apple:hover { background:#1e293b; }
        .lf-social-btn:disabled { opacity:0.6; cursor:not-allowed; }

        .lf-footer-text {
          text-align:center; font-size:12.5px; color:#64748b;
          margin-top:16px; font-family:'Sora',sans-serif;
        }
        .lf-footer-text a { color:#0ea5e9; font-weight:600; text-decoration:none; }
        .lf-footer-text a:hover { text-decoration:underline; }
      `}</style>

      <h1 className="lf-title">Sign In</h1>

      {registered && (
        <div className="lf-alert lf-alert-success">
          ✓ Account created! Sign in to get started.
        </div>
      )}

      {errorMessage && (
        <div className="lf-alert lf-alert-error">⚠ {errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="lf-field">
          <input
            className="lf-input"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span className="lf-icon-btn" style={{ pointerEvents: "none" }}>
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
        </div>

        {/* Password */}
        <div className="lf-field">
          <input
            className="lf-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="lf-icon-btn"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <div className="lf-forgot">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="lf-btn-primary" disabled={isLoading}>
          {isLoading ? <span className="lf-spinner" /> : "Sign in →"}
        </button>
      </form>

      <div className="lf-divider">
        <span>or</span>
      </div>

      <button
        className="lf-social-btn lf-btn-google"
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <span
            className="lf-spinner"
            style={{
              borderTopColor: "#4285F4",
              borderColor: "rgba(66,133,244,0.3)",
            }}
          />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Sign in with Google
      </button>

      <button className="lf-social-btn lf-btn-apple" type="button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        Sign in with Apple
      </button>

      <p className="lf-footer-text">
        Don&apos;t have an account? <Link href="/register">Create one</Link>
      </p>
    </>
  );
}
