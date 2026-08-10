import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const metadata = { title: "Admin — Overview" };

async function getStats() {
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    topProducts,
    ordersByStatus,
    lowStockProducts,
  ] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    db.order.count(),
    db.product.count(),
    db.user.count({ where: { role: "USER" } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    db.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    db.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
        images: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  // Fetch product details for top products
  const topProductIds = topProducts.map((p) => p.productId);
  const topProductDetails = await db.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, images: true, price: true },
  });

  const topProductsWithDetails = topProducts.map((tp) => ({
    ...tp,
    product: topProductDetails.find((p) => p.id === tp.productId)!,
  }));

  // Revenue last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const revenueByDay = await db.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo }, status: { not: "CANCELLED" } },
    select: { total: true, createdAt: true },
  });

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    topProducts: topProductsWithDetails,
    ordersByStatus,
    revenueByDay,
    lowStockProducts,
  };
}

export default async function AdminPage() {
  await requireAdmin();
  const stats = await getStats();
  return <DashboardClient stats={stats} />;
}
