import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AnalyticsClient } from "@/components/admin/AnalyticsClient";

export const metadata = { title: "Admin — Analytics" };

async function getAnalytics() {
  const now = new Date();

  // Date ranges
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    // Revenue
    revenueThisMonth,
    revenuePrevMonth,
    // Orders
    ordersThisMonth,
    ordersPrevMonth,
    // Users
    usersThisMonth,
    usersPrevMonth,
    // Daily revenue (30 days)
    dailyOrders,
    // Monthly revenue (12 months)
    monthlyOrders,
    // Top products
    topProducts,
    // Top categories
    topCategories,
    // Order status
    ordersByStatus,
    // Total stats
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
  ] = await Promise.all([
    db.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    db.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    db.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.order.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),
    db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.user.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),
    db.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { not: "CANCELLED" },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    db.order.findMany({
      where: { createdAt: { gte: startOfYear }, status: { not: "CANCELLED" } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    db.order.groupBy({ by: ["status"], _count: { id: true } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    db.order.count(),
    db.user.count(),
    db.product.count(),
  ]);

  // Fetch product details for top products
  const productIds = [
    ...new Set([
      ...topProducts.map((p) => p.productId),
      ...topCategories.map((p) => p.productId),
    ]),
  ];
  const productDetails = await db.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      images: true,
      price: true,
      category: { select: { name: true } },
    },
  });

  // Build daily revenue chart data (last 30 days)
  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  dailyOrders.forEach((o) => {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    if (dailyMap[key] !== undefined) dailyMap[key] += Number(o.total);
  });
  const dailyRevenue = Object.entries(dailyMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // Build monthly revenue chart data (12 months)
  const monthlyMap: Record<string, number> = {};
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (let i = 0; i < 12; i++) {
    monthlyMap[months[i]] = 0;
  }
  monthlyOrders.forEach((o) => {
    const month = months[new Date(o.createdAt).getMonth()];
    monthlyMap[month] = (monthlyMap[month] ?? 0) + Number(o.total);
  });
  const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  // Top products with details
  const topProductsWithDetails = topProducts
    .map((tp) => ({
      ...tp,
      product: productDetails.find((p) => p.id === tp.productId),
    }))
    .filter((tp) => tp.product);

  // Top categories
  const categoryRevMap: Record<
    string,
    { name: string; revenue: number; count: number }
  > = {};
  topCategories.forEach((tp) => {
    const product = productDetails.find((p) => p.id === tp.productId);
    if (!product) return;
    const catName = product.category.name;
    if (!categoryRevMap[catName])
      categoryRevMap[catName] = { name: catName, revenue: 0, count: 0 };
    categoryRevMap[catName].count += tp._sum.quantity ?? 0;
  });
  const categoryData = Object.values(categoryRevMap).sort(
    (a, b) => b.count - a.count,
  );

  // Growth calculations
  const revenueGrowth = revenuePrevMonth._sum.total
    ? (((revenueThisMonth._sum.total ?? 0) -
        (revenuePrevMonth._sum.total ?? 0)) /
        (revenuePrevMonth._sum.total ?? 1)) *
      100
    : 0;
  const ordersGrowth = ordersPrevMonth
    ? ((ordersThisMonth - ordersPrevMonth) / ordersPrevMonth) * 100
    : 0;
  const usersGrowth = usersPrevMonth
    ? ((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 100
    : 0;

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalUsers,
    totalProducts,
    revenueThisMonth: revenueThisMonth._sum.total ?? 0,
    ordersThisMonth,
    usersThisMonth,
    revenueGrowth,
    ordersGrowth,
    usersGrowth,
    dailyRevenue,
    monthlyRevenue,
    topProducts: topProductsWithDetails,
    categoryData,
    ordersByStatus,
  };
}

export default async function AnalyticsPage() {
  await requireAdmin();
  const data = await getAnalytics();
  return <AnalyticsClient data={data} />;
}
