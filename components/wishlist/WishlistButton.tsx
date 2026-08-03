"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
  size?: "sm" | "md";
  className?: string;
};

export function WishlistButton({
  productId,
  size = "md",
  className = "",
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false); // has fetched initial state

  // Check if already wishlisted on mount
  useEffect(() => {
    if (!session?.user) {
      setChecked(true);
      return;
    }
    fetch(`/api/account/wishlist?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => {
        setWishlisted(d.wishlisted);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [productId, session?.user]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(`/login?callbackUrl=/products`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      setWishlisted(data.wishlisted);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? 14 : 17;

  return (
    <>
      <style>{`
        .wb-btn {
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; border: none; cursor: pointer;
          transition: all 0.2s; position: relative;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 8px rgba(15,23,42,0.12);
        }
        .wb-btn-sm { width: 30px; height: 30px; }
        .wb-btn-md { width: 38px; height: 38px; }

        .wb-btn:hover { transform: scale(1.1); box-shadow: 0 4px 14px rgba(15,23,42,0.18); }
        .wb-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .wb-btn-active { background: #fff1f2; }
        .wb-btn-active svg { color: #ef4444; fill: #ef4444; }

        .wb-btn:not(.wb-btn-active) svg { color: #64748b; }
        .wb-btn:not(.wb-btn-active):hover svg { color: #ef4444; }

        @keyframes wbPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .wb-pop { animation: wbPop 0.35s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      <button
        className={`wb-btn wb-btn-${size} ${wishlisted ? "wb-btn-active" : ""} ${className}`}
        onClick={toggle}
        disabled={loading || !checked}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
      >
        <Heart
          size={iconSize}
          className={wishlisted ? "wb-pop" : ""}
          key={String(wishlisted)} // re-trigger animation on change
        />
      </button>
    </>
  );
}
