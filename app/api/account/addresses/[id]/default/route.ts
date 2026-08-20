import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const addr = await db.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Clear all defaults for this user then set the new one
  await db.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });
  await db.address.update({ where: { id }, data: { isDefault: true } });

  return NextResponse.json({ success: true });
}
