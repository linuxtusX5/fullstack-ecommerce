import type {
  Product,
  Category,
  Order,
  User,
  //   Variant,
  //   Review,
} from "@/app/generated/prisma/client";

// ── Product ───────────────────────────────────────────────────────────────────

export type ProductWithCategory = Product & {
  category: Category;
  //   variants: Variant[];
  _count?: { reviews: number };
};

// ── Filters ───────────────────────────────────────────────────────────────────

export type FilterParams = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "popular";
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
};
