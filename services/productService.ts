import { db } from "@/lib/db";
import type { FilterParams } from "@/types";

export async function getProducts(filters: FilterParams = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 12,
    search,
  } = filters;

  const skip = (page - 1) * limit;

  const where = {
    ...(category && {
      category: { slug: category },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const orderBy = {
    "price-asc": { price: "asc" as const },
    "price-desc": { price: "desc" as const },
    newest: { createdAt: "desc" as const },
    popular: { createdAt: "desc" as const },
  }[sort] ?? { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getFeaturedProducts(limit = 4) {
  return db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
) {
  return db.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
    },
    include: { category: true },
    take: limit,
  });
}
