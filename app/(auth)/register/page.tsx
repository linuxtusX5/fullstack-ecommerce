import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helpers";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create Account — MyStore" };

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <AuthCard
      badge="New platform"
      title={"Create your\nAccount"}
      subtitle={"Join thousands of happy\ncustomers today."}
    >
      <RegisterForm />
    </AuthCard>
  );
}
