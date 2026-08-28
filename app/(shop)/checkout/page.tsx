"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ChevronRight,
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  Lock,
  ArrowLeft,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import {
  CouponInput,
  type CouponResult,
} from "@/components/checkout/CouponInput";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// ── Types ─────────────────────────────────────────────────────────────────────

type ShippingData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const EMPTY_SHIPPING: ShippingData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

type Step = "shipping" | "payment" | "success";

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

.ck-page { background: #fafaf9; min-height: 100vh; font-family: 'Sora', sans-serif; }

/* Hero */
.ck-hero {
  background: #0f172a; padding: 32px 48px;
  position: relative; overflow: hidden;
}
.ck-hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 50% 100% at 100% 50%, rgba(14,165,233,0.08) 0%, transparent 60%);
  pointer-events: none;
}
.ck-hero-inner {
  max-width: 1000px; margin: 0 auto;
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px;
}
.ck-hero-left {}
.ck-hero-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: #0ea5e9; margin-bottom: 4px;
}
.ck-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 700;
  color: #fff; letter-spacing: -0.02em;
}

/* Steps indicator */
.ck-steps {
  display: flex; align-items: center; gap: 0;
}
.ck-step {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.35);
  transition: color 0.3s;
}
.ck-step-active { color: #fff; }
.ck-step-done   { color: #0ea5e9; }
.ck-step-dot {
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  border: 1.5px solid rgba(255,255,255,0.15);
  transition: all 0.3s; flex-shrink: 0;
}
.ck-step-active .ck-step-dot { background: #0ea5e9; border-color: #0ea5e9; color: #fff; }
.ck-step-done   .ck-step-dot { background: #0ea5e9; border-color: #0ea5e9; color: #fff; }
.ck-step-sep {
  width: 28px; height: 1px;
  background: rgba(255,255,255,0.15); margin: 0 4px;
}

/* Layout */
.ck-layout {
  max-width: 1000px; margin: 0 auto;
  padding: 36px 48px 80px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px; align-items: start;
}

/* Panel */
.ck-panel {
  background: #fff; border: 1px solid #f1f5f9;
  border-radius: 20px; overflow: hidden;
}
.ck-panel-header {
  padding: 20px 24px; border-bottom: 1px solid #f8fafc;
  display: flex; align-items: center; gap: 10px;
}
.ck-panel-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: #f0f9ff; color: #0ea5e9;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ck-panel-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.ck-panel-sub   { font-size: 12px; color: #94a3b8; margin-top: 1px; }
.ck-panel-body  { padding: 24px; }

/* Form fields */
.ck-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.ck-label {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8;
}
.ck-input {
  height: 44px; padding: 0 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 13px; color: #0f172a;
  background: #f8fafc; outline: none;
  transition: all 0.2s; box-sizing: border-box; width: 100%;
}
.ck-input:focus { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
.ck-select {
  height: 44px; padding: 0 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 13px; color: #0f172a;
  background: #f8fafc; outline: none;
  transition: all 0.2s; box-sizing: border-box; width: 100%; cursor: pointer;
}
.ck-select:focus { border-color: #0ea5e9; background: #fff; }
.ck-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ck-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

/* Shipping methods */
.ck-shipping-methods { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.ck-shipping-option {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 12px;
  border: 1.5px solid #e2e8f0; cursor: pointer;
  transition: all 0.2s;
}
.ck-shipping-option:hover { border-color: #bae6fd; }
.ck-shipping-option-active { border-color: #0ea5e9; background: #f0f9ff; }
.ck-shipping-radio {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid #e2e8f0; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.ck-shipping-option-active .ck-shipping-radio {
  border-color: #0ea5e9; background: #0ea5e9;
}
.ck-shipping-radio-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #fff;
}
.ck-shipping-info { flex: 1; }
.ck-shipping-name { font-size: 13px; font-weight: 600; color: #0f172a; }
.ck-shipping-desc { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.ck-shipping-price { font-size: 13px; font-weight: 700; color: #0f172a; }

/* Stripe element wrapper */
.ck-stripe-wrap {
  padding: 16px; border: 1.5px solid #e2e8f0;
  border-radius: 12px; background: #f8fafc;
  margin-bottom: 20px; transition: all 0.2s;
}
.ck-stripe-wrap:focus-within { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }

/* Buttons */
.ck-btn-primary {
  width: 100%; height: 50px;
  background: #0f172a; color: #fff;
  border: none; border-radius: 12px;
  font-family: 'Sora', sans-serif;
  font-size: 14px; font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.2s;
}
.ck-btn-primary:hover:not(:disabled) {
  background: #1e293b; transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(15,23,42,0.22);
}
.ck-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.ck-btn-back {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  font-family: 'Sora', sans-serif;
  font-size: 12px; font-weight: 500; color: #64748b;
  padding: 0; margin-bottom: 16px;
  transition: color 0.2s;
}
.ck-btn-back:hover { color: #0f172a; }

/* Error */
.ck-error {
  padding: 12px 14px; border-radius: 10px;
  background: #fef2f2; border: 1px solid #fecaca;
  font-size: 12px; color: #b91c1c; margin-bottom: 16px;
}

/* Secure badge */
.ck-secure {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  margin-top: 12px;
  font-size: 11px; color: #94a3b8; font-weight: 500;
}

/* Order summary card */
.ck-summary {
  background: #fff; border: 1px solid #f1f5f9;
  border-radius: 20px; overflow: hidden;
  position: sticky; top: 88px;
}
.ck-summary-header {
  padding: 18px 20px; border-bottom: 1px solid #f8fafc;
  font-size: 13px; font-weight: 700; color: #0f172a;
}
.ck-summary-items { padding: 12px 20px; }
.ck-summary-item {
  display: flex; gap: 12px; padding: 10px 0;
  border-bottom: 1px solid #f8fafc;
}
.ck-summary-item:last-child { border-bottom: none; }
.ck-summary-img {
  width: 48px; height: 60px; border-radius: 8px;
  overflow: hidden; background: #f1f5f9; flex-shrink: 0;
  position: relative;
}
.ck-summary-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ck-summary-qty {
  position: absolute; top: -4px; right: -4px;
  width: 18px; height: 18px; border-radius: 50%;
  background: #0f172a; color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.ck-summary-item-info { flex: 1; min-width: 0; }
.ck-summary-item-name {
  font-size: 12px; font-weight: 600; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
  line-height: 1.4;
}
.ck-summary-item-price { font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 4px; }

.ck-summary-totals { padding: 14px 20px; border-top: 1px solid #f8fafc; }
.ck-summary-row {
  display: flex; justify-content: space-between;
  font-size: 12px; color: #64748b; margin-bottom: 8px;
}
.ck-summary-row span:last-child { font-weight: 600; color: #374151; }
.ck-summary-total {
  display: flex; justify-content: space-between;
  padding-top: 10px; border-top: 1px solid #e2e8f0; margin-top: 4px;
}
.ck-summary-total span:first-child { font-size: 13px; font-weight: 700; color: #0f172a; }
.ck-summary-total-amt { font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }

/* Success */
.ck-success {
  grid-column: 1 / -1;
  background: #fff; border: 1px solid #f1f5f9;
  border-radius: 24px; padding: 64px 48px;
  text-align: center;
  animation: ckFadeUp 0.5s ease;
}
.ck-success-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: #f0fdf4; margin: 0 auto 20px;
  display: flex; align-items: center; justify-content: center;
  color: #16a34a;
  animation: ckPop 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s both;
}
.ck-success-title {
  font-family: 'Playfair Display', serif;
  font-size: 32px; font-weight: 700; color: #0f172a;
  letter-spacing: -0.02em; margin-bottom: 10px;
}
.ck-success-sub { font-size: 15px; color: #64748b; font-weight: 300; margin-bottom: 32px; }
.ck-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.ck-success-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  height: 48px; padding: 0 32px;
  background: #0f172a; color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 14px; font-weight: 600;
  border-radius: 12px; text-decoration: none;
  transition: all 0.2s;
}
.ck-success-btn-primary:hover { background: #1e293b; transform: translateY(-1px); }
.ck-success-btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  height: 48px; padding: 0 32px;
  background: none; color: #64748b;
  font-family: 'Sora', sans-serif;
  font-size: 14px; font-weight: 600;
  border: 1.5px solid #e2e8f0; border-radius: 12px; text-decoration: none;
  transition: all 0.2s;
}
.ck-success-btn-secondary:hover { border-color: #0f172a; color: #0f172a; }

.ck-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%;
  animation: ckSpin 0.7s linear infinite;
}

@keyframes ckFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ckPop    { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
@keyframes ckSpin   { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .ck-hero { padding: 24px 20px; }
  .ck-layout { grid-template-columns: 1fr; padding: 20px 16px 60px; }
  .ck-summary { position: static; }
  .ck-steps { display: none; }
  .ck-row, .ck-row-3 { grid-template-columns: 1fr; }
}
`;

// ── Shipping step ─────────────────────────────────────────────────────────────

const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard Shipping",
    desc: "5–7 business days",
    price: 9.99,
  },
  {
    id: "express",
    name: "Express Shipping",
    desc: "2–3 business days",
    price: 19.99,
  },
  { id: "free", name: "Free Shipping", desc: "7–10 business days", price: 0 },
];

function ShippingStep({
  data,
  onChange,
  onNext,
  shippingMethod,
  onShippingMethod,
  subtotal,
}: {
  data: ShippingData;
  onChange: (d: ShippingData) => void;
  onNext: () => void;
  shippingMethod: string;
  onShippingMethod: (id: string) => void;
  subtotal: number;
}) {
  const set = (k: keyof ShippingData, v: string) =>
    onChange({ ...data, [k]: v });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const methods =
    subtotal >= 100
      ? SHIPPING_METHODS
      : SHIPPING_METHODS.filter((m) => m.id !== "free");

  return (
    <form onSubmit={handleSubmit}>
      <div className="ck-panel">
        <div className="ck-panel-header">
          <div className="ck-panel-icon">
            <MapPin size={16} />
          </div>
          <div>
            <p className="ck-panel-title">Shipping address</p>
            <p className="ck-panel-sub">Where should we send your order?</p>
          </div>
        </div>
        <div className="ck-panel-body">
          <div className="ck-row">
            <div className="ck-field">
              <label className="ck-label">First name</label>
              <input
                className="ck-input"
                value={data.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </div>
            <div className="ck-field">
              <label className="ck-label">Last name</label>
              <input
                className="ck-input"
                value={data.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="ck-row">
            <div className="ck-field">
              <label className="ck-label">Email</label>
              <input
                className="ck-input"
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>
            <div className="ck-field">
              <label className="ck-label">Phone</label>
              <input
                className="ck-input"
                type="tel"
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="ck-field">
            <label className="ck-label">Address line 1</label>
            <input
              className="ck-input"
              value={data.line1}
              onChange={(e) => set("line1", e.target.value)}
              placeholder="Street address"
              required
            />
          </div>
          <div className="ck-field">
            <label className="ck-label">
              Address line 2{" "}
              <span style={{ color: "#cbd5e1" }}>(optional)</span>
            </label>
            <input
              className="ck-input"
              value={data.line2}
              onChange={(e) => set("line2", e.target.value)}
              placeholder="Apt, suite, etc."
            />
          </div>
          <div className="ck-row-3">
            <div className="ck-field">
              <label className="ck-label">City</label>
              <input
                className="ck-input"
                value={data.city}
                onChange={(e) => set("city", e.target.value)}
                required
              />
            </div>
            <div className="ck-field">
              <label className="ck-label">State</label>
              <input
                className="ck-input"
                value={data.state}
                onChange={(e) => set("state", e.target.value)}
                required
              />
            </div>
            <div className="ck-field">
              <label className="ck-label">Postal code</label>
              <input
                className="ck-input"
                value={data.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="ck-field">
            <label className="ck-label">Country</label>
            <select
              className="ck-select"
              value={data.country}
              onChange={(e) => set("country", e.target.value)}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="PH">Philippines</option>
              <option value="SG">Singapore</option>
            </select>
          </div>

          {/* Shipping method */}
          <p
            className="ck-label"
            style={{ marginBottom: 10, display: "block" }}
          >
            Shipping method
          </p>
          <div className="ck-shipping-methods">
            {methods.map((m) => (
              <div
                key={m.id}
                className={`ck-shipping-option ${shippingMethod === m.id ? "ck-shipping-option-active" : ""}`}
                onClick={() => onShippingMethod(m.id)}
              >
                <div className="ck-shipping-radio">
                  {shippingMethod === m.id && (
                    <div className="ck-shipping-radio-dot" />
                  )}
                </div>
                <div className="ck-shipping-info">
                  <p className="ck-shipping-name">{m.name}</p>
                  <p className="ck-shipping-desc">{m.desc}</p>
                </div>
                <span className="ck-shipping-price">
                  {m.price === 0 ? "Free" : `$${m.price.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>

          <button type="submit" className="ck-btn-primary">
            Continue to payment <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Payment form (inside Stripe Elements) ─────────────────────────────────────

function PaymentForm({
  onSuccess,
  onBack,
  total,
}: {
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
  total: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?success=true`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" className="ck-btn-back" onClick={onBack}>
        <ArrowLeft size={14} /> Back to shipping
      </button>

      <div className="ck-panel">
        <div className="ck-panel-header">
          <div className="ck-panel-icon">
            <CreditCard size={16} />
          </div>
          <div>
            <p className="ck-panel-title">Payment details</p>
            <p className="ck-panel-sub">
              Your payment info is encrypted and secure
            </p>
          </div>
        </div>
        <div className="ck-panel-body">
          {error && <div className="ck-error">⚠ {error}</div>}

          <div className="ck-stripe-wrap">
            <PaymentElement options={{ layout: "tabs" }} />
          </div>

          <button
            type="submit"
            className="ck-btn-primary"
            disabled={!stripe || loading}
          >
            {loading ? (
              <>
                <span className="ck-spinner" /> Processing…
              </>
            ) : (
              <>
                <Lock size={14} /> Pay ${total.toFixed(2)}
              </>
            )}
          </button>

          <div className="ck-secure">
            <Lock size={11} /> Secured by Stripe · SSL encrypted
          </div>
        </div>
      </div>
    </form>
  );
}

// ── Payment step wrapper ──────────────────────────────────────────────────────

function PaymentStep({
  items,
  total,
  onSuccess,
  onBack,
}: {
  items: any[];
  total: number;
  onSuccess: (id: string) => void;
  onBack: () => void;
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/checkout/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, items }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.clientSecret) setClientSecret(d.clientSecret);
        else setLoadError(d.error ?? "Failed to initialise payment");
      })
      .catch(() => setLoadError("Network error"));
  }, [total, items]);

  if (loadError) return <div className="ck-error">⚠ {loadError}</div>;
  if (!clientSecret)
    return (
      <div
        className="ck-panel"
        style={{ padding: "48px 24px", textAlign: "center" }}
      >
        <span
          className="ck-spinner"
          style={{
            borderTopColor: "#0ea5e9",
            borderColor: "#e2e8f0",
            margin: "0 auto",
          }}
        />
      </div>
    );

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0ea5e9",
            colorBackground: "#ffffff",
            colorText: "#0f172a",
            borderRadius: "10px",
            fontFamily: "Sora, sans-serif",
          },
        },
      }}
    >
      <PaymentForm onSuccess={onSuccess} onBack={onBack} total={total} />
    </Elements>
  );
}

// ── Success step ──────────────────────────────────────────────────────────────

function SuccessStep({ orderId }: { orderId: string }) {
  return (
    <div className="ck-success">
      <div className="ck-success-icon">
        <CheckCircle size={36} />
      </div>
      <h1 className="ck-success-title">Order confirmed!</h1>
      <p className="ck-success-sub">
        Thank you for your purchase. We'll email you when your order ships.
        <br />
        <span style={{ color: "#94a3b8", fontSize: "13px" }}>
          Order ref: #{orderId.slice(-8).toUpperCase()}
        </span>
      </p>
      <div className="ck-success-actions">
        <Link href="/account/orders" className="ck-success-btn-primary">
          <ShoppingBag size={16} /> View my orders
        </Link>
        <Link href="/products" className="ck-success-btn-secondary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

// ── Main checkout page ────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [orderId, setOrderId] = useState("");

  const subtotal = mounted ? getTotalPrice() : 0;
  const cartItems = mounted ? items : [];
  const shippingCost =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 9.99;
  // const total = subtotal + shippingCost;
  const finalAmount = subtotal + shippingCost - (coupon?.discount ?? 0);

  // Redirect if cart empty (after mount)
  useEffect(() => {
    if (mounted && cartItems.length === 0 && step !== "success") {
      router.replace("/cart");
    }
  }, [mounted, cartItems.length, step, router]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setOrderId(paymentIntentId);
    clearCart();
    setStep("success");
  };

  const stepConfig = [
    { id: "shipping", label: "Shipping", num: 1 },
    { id: "payment", label: "Payment", num: 2 },
    { id: "success", label: "Confirm", num: 3 },
  ];

  const stripeItems = cartItems.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
    price: i.product.price,
  }));

  return (
    <>
      <style>{CSS}</style>
      <div className="ck-page">
        {/* Hero */}
        <div className="ck-hero">
          <div className="ck-hero-inner">
            <div className="ck-hero-left">
              <p className="ck-hero-eyebrow">Secure Checkout</p>
              <h1 className="ck-hero-title">Complete your order</h1>
            </div>

            {/* Steps */}
            <div className="ck-steps">
              {stepConfig.map((s, i) => {
                const isDone = stepConfig.findIndex((x) => x.id === step) > i;
                const isActive = s.id === step;
                return (
                  <div
                    key={s.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {i > 0 && <div className="ck-step-sep" />}
                    <div
                      className={`ck-step ${isActive ? "ck-step-active" : ""} ${isDone ? "ck-step-done" : ""}`}
                    >
                      <div className="ck-step-dot">{isDone ? "✓" : s.num}</div>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="ck-layout">
          {step === "success" ? (
            <SuccessStep orderId={orderId} />
          ) : (
            <>
              {/* Left: steps */}
              <div>
                {step === "shipping" && (
                  <ShippingStep
                    data={shipping}
                    onChange={setShipping}
                    onNext={() => setStep("payment")}
                    shippingMethod={shippingMethod}
                    onShippingMethod={setShippingMethod}
                    subtotal={subtotal}
                  />
                )}
                {step === "payment" && (
                  <PaymentStep
                    items={stripeItems}
                    total={finalAmount}
                    onSuccess={handlePaymentSuccess}
                    onBack={() => setStep("shipping")}
                  />
                )}
              </div>

              {/* Right: order summary */}
              <div className="ck-summary">
                <div className="ck-summary-header">
                  Order summary · {cartItems.length} item
                  {cartItems.length !== 1 ? "s" : ""}
                </div>

                <div className="ck-summary-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="ck-summary-item">
                      <div className="ck-summary-img">
                        <img
                          src={item.product.images?.[0] ?? "/placeholder.jpg"}
                          alt={item.product.name}
                        />
                        <span className="ck-summary-qty">{item.quantity}</span>
                      </div>
                      <div className="ck-summary-item-info">
                        <p className="ck-summary-item-name">
                          {item.product.name}
                        </p>
                        <p className="ck-summary-item-price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ck-summary-totals">
                  <div className="ck-summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="ck-summary-row">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? "Free"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <CouponInput
                    subtotal={subtotal}
                    applied={coupon}
                    onApply={setCoupon}
                    onRemove={() => setCoupon(null)}
                  />
                  <div className="ck-summary-total">
                    <span>Total</span>
                    <span className="ck-summary-total-amt">
                      ${finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
