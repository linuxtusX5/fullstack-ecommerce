import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const metadata = { title: "Admin — Categories" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return <AdminCategoriesClient categories={categories} />;
}
