import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  await requireAdmin();
  const { name, slug, image } = await req.json();

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 },
    );
  }

  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const category = await db.category.create({
    data: { name, slug, image: image ?? null },
  });
  return NextResponse.json(category, { status: 201 });
}
