import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { AddressesPanel } from "@/components/account/AddressesPanel";

export const metadata = { title: "Addresses — My Account" };

async function getAddresses(userId: string) {
  try {
    return await db.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export default async function AddressesPage() {
  const user = await requireAuth();
  const addresses = await getAddresses(user.id!);
  return <AddressesPanel addresses={addresses} />;
}
