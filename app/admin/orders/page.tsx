import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdmin();
  const { status, page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const limit = 15;

  const where = status ? { status: status as any } : {};

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.order.count({ where }),
  ]);

  return (
    <AdminOrdersClient
      orders={orders}
      total={total}
      page={page}
      pages={Math.ceil(total / limit)}
      currentStatus={status}
    />
  );
}
