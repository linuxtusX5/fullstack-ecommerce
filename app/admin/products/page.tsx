import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const metadata = { title: "Admin — Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await requireAdmin();
  const { page: pageStr, q = "" } = await searchParams;
  const page = Number(pageStr) || 1;
  const limit = 15;

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminProductsClient
      products={products}
      categories={categories}
      total={total}
      page={page}
      pages={Math.ceil(total / limit)}
      query={q}
    />
  );
}
