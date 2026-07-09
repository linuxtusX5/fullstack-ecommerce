import { getServerSession } from "next-auth";
import { authOptions } from "./options";
import { redirect } from "next/navigation";

export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
