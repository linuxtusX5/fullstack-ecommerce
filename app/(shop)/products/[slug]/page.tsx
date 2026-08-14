import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/services/productService";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import type { Metadata } from "next";
import { ProductReviews } from "@/components/product/ProductReviews";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — MyStore`,
    description: product.description,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Sora:wght@300;400;500;600;700&display=swap');

        .pd-page { min-height: 100vh; background: #fafaf9; }

        .pd-breadcrumb-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 48px 0;
        }

        .pd-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 48px 64px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        .pd-related {
          background: #fff;
          border-top: 1px solid #f1f5f9;
          padding: 64px 0;
        }

        .pd-related-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .pd-related-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        .pd-related-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .pd-related-link {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0ea5e9;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .pd-related-link:hover { opacity: 0.7; }

        @media (max-width: 1024px) {
          .pd-main { gap: 40px; padding: 24px 24px 48px; }
          .pd-breadcrumb-wrap { padding: 16px 24px 0; }
          .pd-related-inner { padding: 0 24px; }
        }

        @media (max-width: 768px) {
          .pd-main { grid-template-columns: 1fr; gap: 32px; padding: 20px 16px 40px; }
          .pd-breadcrumb-wrap { padding: 12px 16px 0; }
          .pd-related-inner { padding: 0 16px; }
          .pd-related { padding: 40px 0; }
        }
      `}</style>

      <div className="pd-page">
        <div className="pd-breadcrumb-wrap">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              {
                label: product.category.name,
                href: `/products?category=${product.category.slug}`,
              },
              { label: product.name },
            ]}
          />
        </div>
        <div className="pd-main">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
        {related.length > 0 && (
          <section className="pd-related">
            <div className="pd-related-inner">
              <div className="pd-related-header">
                <h2 className="pd-related-title">You might also like</h2>
                <a
                  href={`/products?category=${product.category.slug}`}
                  className="pd-related-link"
                >
                  View all {product.category.name} →
                </a>
              </div>
              <RelatedProducts products={related} />
            </div>
          </section>
        )}{" "}
        {/* Reviews — always show */}
        <section className="pd-related">
          <div className="pd-related-inner">
            <ProductReviews productId={product.id} />
          </div>
        </section>
      </div>
    </>
  );
}
