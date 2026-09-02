import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  const reviews = await db.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, avg, total: reviews.length });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await params;
  const { rating, title, body } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }
  if (!body?.trim()) {
    return NextResponse.json(
      { error: "Review body is required" },
      { status: 400 },
    );
  }

  // Check if user already reviewed this product
  const existing = await db.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    // Update existing review
    const review = await db.review.update({
      where: { userId_productId: { userId: session.user.id, productId } },
      data: { rating, title, body },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(review);
  }

  // Create new review
  const review = await db.review.create({
    data: {
      userId: session.user.id,
      productId,
      rating,
      title: title ?? null,
      body,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(review, { status: 201 });
}
