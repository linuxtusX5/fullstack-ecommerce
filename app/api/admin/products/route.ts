import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json();
  const { name, slug, description, price, stock, categoryId, images } = body;

  if (!name || !slug || !description || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId,
      images: images ?? [],
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
