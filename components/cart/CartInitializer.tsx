"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initCartForUser } from "@/store/cartStore";

export function CartInitializer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    initCartForUser(session?.user?.id);
  }, [session?.user?.id, status]);

  return null;
}
