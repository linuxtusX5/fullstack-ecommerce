import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";

// POST /api/account/wishlist  { productId }  → toggle (add or remove)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId)
    return NextResponse.json({ error: "productId required" }, { status: 400 });

  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ wishlisted: false });
  }

  await db.wishlistItem.create({
    data: { userId: session.user.id, productId },
  });
  return NextResponse.json({ wishlisted: true });
}

// GET /api/account/wishlist?productId=xxx  → check if wishlisted
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ wishlisted: false });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId)
    return NextResponse.json({ error: "productId required" }, { status: 400 });

  const item = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  return NextResponse.json({ wishlisted: !!item });
}
