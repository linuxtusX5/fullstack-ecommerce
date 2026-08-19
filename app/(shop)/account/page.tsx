import { requireAuth } from "@/lib/auth/helpers";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata = { title: "Profile — My Account" };

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <ProfileForm
      user={{ id: user.id!, name: user.name ?? "", email: user.email! }}
    />
  );
}
