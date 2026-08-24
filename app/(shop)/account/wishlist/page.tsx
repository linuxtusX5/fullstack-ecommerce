import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { WishlistGrid } from "@/components/account/WishlistGrid";

export const metadata = { title: "Wishlist — My Account" };

async function getWishlist(userId: string) {
  try {
    return await db.wishlistItem.findMany({
      where: { userId },
      include: {
        product: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function WishlistPage() {
  const user = await requireAuth();
  const items = await getWishlist(user.id!);
  return <WishlistGrid items={items} />;
}
