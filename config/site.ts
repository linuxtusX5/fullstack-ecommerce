export const siteConfig = {
  name: "MyStore",
  description: "E commerce",
  url: process.env.NEXT_PUBLIC_APP_URL!,
  nav: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ],
  social: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
};
