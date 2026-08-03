"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import type { FilterParams } from "@/types";

type Props = {
  currentSort?: FilterParams["sort"];
};

const SORT_OPTIONS: { value: FilterParams["sort"]; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function SortDropdown({ currentSort = "newest" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600&display=swap');

        .sd-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .sd-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
          z-index: 1;
        }

        .sd-select {
          height: 38px;
          padding: 0 36px 0 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          background: #fff;
          cursor: pointer;
          outline: none;
          appearance: none;
          transition: all 0.2s;
          min-width: 190px;
        }

        .sd-select:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }

        .sd-select:hover { border-color: #cbd5e1; }

        .sd-arrow {
          position: absolute;
          right: 12px;
          pointer-events: none;
          color: #94a3b8;
          font-size: 10px;
        }
      `}</style>

      <div className="sd-wrap">
        <ArrowUpDown size={13} className="sd-icon" />
        <select
          className="sd-select"
          value={currentSort}
          onChange={handleChange}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="sd-arrow">▾</span>
      </div>
    </>
  );
}
