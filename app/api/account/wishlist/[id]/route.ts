import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";

// DELETE /api/account/wishlist/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Ensure the item belongs to this user
  const item = await db.wishlistItem.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.wishlistItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
