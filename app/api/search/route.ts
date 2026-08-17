import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? "8"), 20);

  if (q.length < 2) {
    return NextResponse.json({ products: [], total: 0 });
  }

  try {
    const [products, total] = await Promise.all([
      db.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      db.product.count({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
      }),
    ]);

    return NextResponse.json({ products, total });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ products: [], total: 0 });
  }
}
