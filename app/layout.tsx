import type { Metadata } from "next";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { CartInitializer } from "@/components/cart/CartInitializer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyStore — Shop the Latest",
  description: "Discover curated collections of fashion, accessories and more.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          {children}
          <CartInitializer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
