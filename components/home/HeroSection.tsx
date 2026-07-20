"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

const slides = [
  {
    tag: "New Collection 2025",
    headline: "Dress for the\nLife You Want",
    sub: "Curated pieces that blend timeless style with modern edge.",
    cta: { label: "Shop Collection", href: "/products" },
    ctaSecondary: { label: "Watch Film", href: "#" },
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    accent: "#f59e0b",
  },
  {
    tag: "Limited Drop",
    headline: "Summer Essentials\nArrived",
    sub: "Light fabrics, bold silhouettes — made for the warm season.",
    cta: { label: "Explore Now", href: "/category/women" },
    ctaSecondary: { label: "See Lookbook", href: "#" },
    bg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
    accent: "#0ea5e9",
  },
  {
    tag: "Men's Edit",
    headline: "Sharp Lines,\nBold Presence",
    sub: "Elevated basics and statement pieces for the modern wardrobe.",
    cta: { label: "Shop Men", href: "/category/men" },
    ctaSecondary: { label: "Style Guide", href: "#" },
    bg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1600&q=80",
    accent: "#10b981",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Sora:wght@300;400;500;600&display=swap');

        .hero {
          position: relative;
          height: 92vh;
          min-height: 600px;
          max-height: 900px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          transition: opacity 0.5s ease;
        }

        .hero-bg img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 8s ease;
        }

        .hero:hover .hero-bg img {
          transform: scale(1.04);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(10,10,15,0.85) 0%,
            rgba(10,10,15,0.5) 50%,
            rgba(10,10,15,0.1) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          width: 100%;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 20px;
          animation: heroFadeUp 0.7s 0.1s both;
        }

        .hero-tag::before {
          content: '';
          width: 28px; height: 2px;
          background: currentColor;
          border-radius: 2px;
        }

        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 900;
          color: #fff;
          line-height: 1.0;
          letter-spacing: -0.02em;
          white-space: pre-line;
          margin-bottom: 24px;
          animation: heroFadeUp 0.7s 0.2s both;
          max-width: 700px;
        }

        .hero-sub {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 40px;
          animation: heroFadeUp 0.7s 0.3s both;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          animation: heroFadeUp 0.7s 0.4s both;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 52px;
          padding: 0 28px;
          background: #fff;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.25s;
          letter-spacing: 0.01em;
        }

        .hero-btn-primary:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        .hero-btn-primary svg {
          transition: transform 0.2s;
        }
        .hero-btn-primary:hover svg {
          transform: translateX(4px);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 52px;
          padding: 0 24px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 500;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.25s;
        }

        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .hero-play {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Slide dots */
        .hero-dots {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 3;
        }

        .hero-dot {
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          padding: 0;
        }

        .hero-dot-active {
          background: #fff;
          width: 28px !important;
        }

        /* Slide counter */
        .hero-counter {
          position: absolute;
          bottom: 32px;
          right: 48px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          z-index: 3;
          letter-spacing: 0.1em;
        }

        .hero-counter strong {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }

        /* Scroll indicator */
        .hero-scroll {
          position: absolute;
          bottom: 32px;
          left: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 3;
        }

        .hero-scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        .hero-scroll-label {
          font-family: 'Sora', sans-serif;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          writing-mode: vertical-lr;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.1); }
        }

        .hero-animating .hero-tag,
        .hero-animating .hero-headline,
        .hero-animating .hero-sub,
        .hero-animating .hero-actions {
          opacity: 0;
          transform: translateY(16px);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .hero-content { padding: 0 24px; }
          .hero-scroll   { display: none; }
          .hero-counter  { display: none; }
        }
      `}</style>

      <section className={`hero ${animating ? "hero-animating" : ""}`}>
        {/* Background */}
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.bg} alt="" aria-hidden="true" />
        </div>
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-content">
          <p className="hero-tag" style={{ color: slide.accent }}>
            {slide.tag}
          </p>
          <h1 className="hero-headline">{slide.headline}</h1>
          <p className="hero-sub">{slide.sub}</p>
          <div className="hero-actions">
            <Link href={slide.cta.href} className="hero-btn-primary">
              {slide.cta.label}
              <ArrowRight size={16} />
            </Link>
            <Link href={slide.ctaSecondary.href} className="hero-btn-secondary">
              <span className="hero-play">
                <Play size={12} fill="white" />
              </span>
              {slide.ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? "hero-dot-active" : ""}`}
              style={{ width: i === current ? 28 : 12 }}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="hero-counter">
          <strong>0{current + 1}</strong> / 0{slides.length}
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span className="hero-scroll-label">Scroll</span>
        </div>
      </section>
    </>
  );
}
