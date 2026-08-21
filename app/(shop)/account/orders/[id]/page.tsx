import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  ArrowLeft,
} from "lucide-react";

export const metadata = { title: "Order Details — My Account" };

const STATUS_STEPS = [
  {
    key: "PENDING",
    label: "Order Placed",
    icon: Clock,
    desc: "Your order has been received",
  },
  {
    key: "PAID",
    label: "Payment Confirmed",
    icon: CheckCircle,
    desc: "Payment successfully processed",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: Truck,
    desc: "Your order is on its way",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: Package,
    desc: "Order delivered successfully",
  },
];

const STATUS_ORDER = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();

  const order = await db.order.findFirst({
    where: { id, userId: user.id! },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: true, slug: true } },
        },
      },
    },
  });

  if (!order) notFound();

  const isCancelled = order.status === "CANCELLED";
  const currentStep = STATUS_ORDER.indexOf(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

        .ot-root { font-family: 'Sora', sans-serif; max-width: 760px; margin: 0 auto; padding: 32px 24px 80px; }

        .ot-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none; margin-bottom: 24px; transition: color 0.2s; }
        .ot-back:hover { color: #0f172a; }

        .ot-header { margin-bottom: 28px; }
        .ot-header-top { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 6px; }
        .ot-order-id { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
        .ot-order-date { font-size: 13px; color: #94a3b8; margin-top: 4px; }

        .ot-status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; }

        /* Timeline */
        .ot-timeline { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 28px; margin-bottom: 20px; }
        .ot-timeline-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 28px; }

        .ot-steps { display: flex; align-items: flex-start; position: relative; }

        .ot-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; }

        /* Line between steps */
        .ot-step-connector {
          position: absolute; top: 18px;
          left: 50%; right: -50%;
          height: 2px; background: #f1f5f9; z-index: 0;
        }
        .ot-step-connector-done { background: #0f172a; }

        .ot-step-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #e2e8f0; background: #fff; margin-bottom: 10px; position: relative; z-index: 1; transition: all 0.3s; flex-shrink: 0; }
        .ot-step-icon-done    { background: #0f172a !important; border-color: #0f172a !important; color: #fff; }
        .ot-step-icon-current { background: #0ea5e9 !important; border-color: #0ea5e9 !important; color: #fff; box-shadow: 0 0 0 4px rgba(14,165,233,0.15); }
        .ot-step-icon-pending { color: #cbd5e1; }

        .ot-step-label { font-size: 11px; font-weight: 600; color: #0f172a; margin-bottom: 3px; }
        .ot-step-label-pending { color: #cbd5e1 !important; }
        .ot-step-desc { font-size: 10px; color: #94a3b8; line-height: 1.4; max-width: 80px; }

        /* Cancelled */
        .ot-cancelled { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; }
        .ot-cancelled-title { font-size: 14px; font-weight: 700; color: #dc2626; }
        .ot-cancelled-sub { font-size: 12px; color: #f87171; margin-top: 3px; }

        /* Items */
        .ot-items { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; overflow: hidden; margin-bottom: 20px; }
        .ot-items-header { padding: 16px 20px; border-bottom: 1px solid #f8fafc; font-size: 13px; font-weight: 700; color: #0f172a; }
        .ot-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid #f8fafc; }
        .ot-item:last-child { border-bottom: none; }
        .ot-item-img { width: 56px; height: 68px; border-radius: 10px; overflow: hidden; background: #f1f5f9; flex-shrink: 0; }
        .ot-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .ot-item-name { font-size: 13px; font-weight: 600; color: #0f172a; text-decoration: none; transition: color 0.2s; display: block; }
        .ot-item-name:hover { color: #0ea5e9; }
        .ot-item-qty { font-size: 12px; color: #94a3b8; margin-top: 3px; }
        .ot-item-price { margin-left: auto; font-size: 14px; font-weight: 700; color: #0f172a; flex-shrink: 0; }

        /* Summary */
        .ot-summary { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 20px; }
        .ot-summary-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .ot-summary-label { color: #64748b; }
        .ot-summary-value { font-weight: 600; color: #0f172a; }
        .ot-summary-divider { height: 1px; background: #f1f5f9; margin: 10px 0; }
        .ot-summary-total { display: flex; align-items: center; justify-content: space-between; }
        .ot-summary-total-label { font-size: 15px; font-weight: 700; color: #0f172a; }
        .ot-summary-total-value { font-size: 18px; font-weight: 700; color: #0f172a; }

        .ot-help { margin-top: 24px; text-align: center; font-size: 13px; color: #94a3b8; }
        .ot-help a { color: #0ea5e9; font-weight: 600; text-decoration: none; }
        .ot-help a:hover { text-decoration: underline; }

        @media (max-width: 640px) {
          .ot-root { padding: 20px 16px 60px; }
          .ot-step-desc { display: none; }
          .ot-step-label { font-size: 10px; }
        }
      `}</style>

      <div className="ot-root">
        <Link href="/account/orders" className="ot-back">
          <ArrowLeft size={15} /> Back to orders
        </Link>

        {/* Header */}
        <div className="ot-header">
          <div className="ot-header-top">
            <div>
              <h1 className="ot-order-id">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="ot-order-date">Placed on {formattedDate}</p>
            </div>
            {isCancelled ? (
              <span
                className="ot-status-badge"
                style={{ background: "#fef2f2", color: "#dc2626" }}
              >
                <XCircle size={13} /> Cancelled
              </span>
            ) : (
              <span
                className="ot-status-badge"
                style={{
                  background:
                    order.status === "DELIVERED"
                      ? "#f0fdf4"
                      : order.status === "SHIPPED"
                        ? "#f5f3ff"
                        : "#f0f9ff",
                  color:
                    order.status === "DELIVERED"
                      ? "#16a34a"
                      : order.status === "SHIPPED"
                        ? "#7c3aed"
                        : "#0284c7",
                }}
              >
                {order.status === "DELIVERED" ? (
                  <CheckCircle size={13} />
                ) : order.status === "SHIPPED" ? (
                  <Truck size={13} />
                ) : (
                  <Clock size={13} />
                )}
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </span>
            )}
          </div>
        </div>

        {/* Tracking timeline */}
        <div className="ot-timeline">
          <p className="ot-timeline-title">
            {isCancelled ? "Order Status" : "Order Tracking"}
          </p>

          {isCancelled ? (
            <div className="ot-cancelled">
              <XCircle size={28} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <p className="ot-cancelled-title">
                  This order has been cancelled
                </p>
                <p className="ot-cancelled-sub">
                  If you were charged, a refund will be processed within 5–10
                  business days.
                </p>
              </div>
            </div>
          ) : (
            <div className="ot-steps">
              {STATUS_STEPS.map((step, i) => {
                const isDone = currentStep > i;
                const isCurrent = currentStep === i;
                const isPending = currentStep < i;
                const isLast = i === STATUS_STEPS.length - 1;

                return (
                  <div key={step.key} className="ot-step">
                    {!isLast && (
                      <div
                        className={`ot-step-connector ${isDone ? "ot-step-connector-done" : ""}`}
                      />
                    )}
                    <div
                      className={`ot-step-icon ${isDone ? "ot-step-icon-done" : isCurrent ? "ot-step-icon-current" : "ot-step-icon-pending"}`}
                    >
                      <step.icon size={15} />
                    </div>
                    <p
                      className={`ot-step-label ${isPending ? "ot-step-label-pending" : ""}`}
                    >
                      {step.label}
                    </p>
                    <p className="ot-step-desc">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="ot-items">
          <p className="ot-items-header">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
          {order.items.map((item) => (
            <div key={item.id} className="ot-item">
              <div className="ot-item-img">
                <img
                  src={item.product.images?.[0] ?? "/placeholder.jpg"}
                  alt={item.product.name}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="ot-item-name"
                >
                  {item.product.name}
                </Link>
                <p className="ot-item-qty">Qty: {item.quantity}</p>
              </div>
              <span className="ot-item-price">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="ot-summary">
          <div className="ot-summary-row">
            <span className="ot-summary-label">Subtotal</span>
            <span className="ot-summary-value">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
          <div className="ot-summary-row">
            <span className="ot-summary-label">Shipping</span>
            <span className="ot-summary-value" style={{ color: "#10b981" }}>
              Free
            </span>
          </div>
          <div className="ot-summary-divider" />
          <div className="ot-summary-total">
            <span className="ot-summary-total-label">Total</span>
            <span className="ot-summary-total-value">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        <p className="ot-help">
          Need help? <Link href="/account/orders">View all orders</Link>
        </p>
      </div>
    </>
  );
}
