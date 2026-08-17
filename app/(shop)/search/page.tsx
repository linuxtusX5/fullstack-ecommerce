import { SearchClient } from "@/components/search/SearchClient";

export const metadata = { title: "Search — MyStore" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return <SearchClient initialQuery={q} />;
}
