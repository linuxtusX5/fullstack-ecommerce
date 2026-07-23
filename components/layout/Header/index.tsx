"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        data-scrolled={scrolled}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,1)",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid rgba(0,0,0,0.06)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <Navbar
          scrolled={scrolled}
          onMobileMenuToggle={() => setMobileOpen((v) => !v)}
          onSearchOpen={() => setSearchOpen(true)}
          mobileOpen={mobileOpen}
        />
      </header>

      {/* Mobile menu — rendered outside header so it overlays everything */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Search overlay */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
