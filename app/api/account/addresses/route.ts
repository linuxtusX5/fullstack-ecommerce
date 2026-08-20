import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";
import { z } from "zod";

const Schema = z.object({
  label: z.string().min(1).max(32).default("Home"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2).max(2).default("US"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { isDefault, ...data } = parsed.data;

  // If setting as default, clear existing defaults first
  if (isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  // If this is the first address, auto-default it
  const count = await db.address.count({ where: { userId: session.user.id } });

  const address = await db.address.create({
    data: {
      ...data,
      userId: session.user.id,
      isDefault: isDefault || count === 0,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
