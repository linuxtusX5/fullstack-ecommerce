import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import {
  TrustBar,
  CategoryStrip,
  Promobanner,
  NewsletterSection,
} from "@/components/home/sections";
import {
  FeaturedProducts,
  NewArrivals,
  ProductGridSkeleton,
} from "@/components/home/products";
import { db } from "@/lib/db";

export const revalidate = 60;

export const metadata = {
  title: "MyStore — Shop the Latest",
  description: "Discover curated collections of fashion, accessories and more.",
};

async function getHomeData() {
  const [categories, featuredProducts, newArrivals] = await Promise.all([
    db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    db.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  return { categories, featuredProducts, newArrivals };
}

export default async function HomePage() {
  const { categories, featuredProducts, newArrivals } = await getHomeData();

  return (
    <div style={{ overflowX: "hidden" }}>
      <HeroSection />
      <TrustBar />
      <CategoryStrip categories={categories} />
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>
      <Promobanner />
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <NewArrivals products={newArrivals} />
      </Suspense>
      <NewsletterSection />
    </div>
  );
}
