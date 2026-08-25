import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AdminCouponsClient } from "@/components/admin/AdminCouponsClient";

export const metadata = { title: "Admin — Coupons" };

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });
  return <AdminCouponsClient coupons={coupons} />;
}
