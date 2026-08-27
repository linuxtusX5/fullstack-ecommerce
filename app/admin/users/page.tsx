import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await requireAdmin();
  const { page: pageStr, q = "" } = await searchParams;
  const page = Number(pageStr) || 1;
  const limit = 20;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true, wishlistItems: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.user.count({ where }),
  ]);

  return (
    <AdminUsersClient
      users={users}
      total={total}
      page={page}
      pages={Math.ceil(total / limit)}
      query={q}
    />
  );
}
