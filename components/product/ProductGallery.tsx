"use client";

import { useState } from "react";

type Props = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const list =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500&display=swap');

        .pg-root { display: flex; flex-direction: column; gap: 12px; }

        .pg-main {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 20px;
          overflow: hidden;
          background: #f1f5f9;
          cursor: zoom-in;
          user-select: none;
        }

        .pg-main-zoomed { cursor: zoom-out; }

        .pg-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .pg-img-normal:hover { transform: scale(1.03); }

        .pg-img-zoomed {
          transform: scale(2.2);
          transition: transform-origin 0s linear;
        }

        .pg-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.92);
          border: none; border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; line-height: 1;
          z-index: 2;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
        }

        .pg-main:hover .pg-arrow { opacity: 1; }
        .pg-arrow:hover { transform: translateY(-50%) scale(1.08); }
        .pg-arrow-l { left: 12px; }
        .pg-arrow-r { right: 12px; }

        .pg-counter {
          position: absolute; bottom: 14px; left: 50%;
          transform: translateX(-50%);
          background: rgba(15,23,42,0.65);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 4px 12px;
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.85);
          pointer-events: none; z-index: 2;
        }

        .pg-thumbs {
          display: flex; gap: 8px;
          overflow-x: auto; scrollbar-width: none;
        }
        .pg-thumbs::-webkit-scrollbar { display: none; }

        .pg-thumb {
          flex-shrink: 0;
          width: 72px; height: 72px;
          border-radius: 12px; overflow: hidden;
          cursor: pointer; border: none; padding: 0;
          outline: 2.5px solid transparent;
          outline-offset: 2px;
          transition: outline-color 0.2s;
          background: #f1f5f9;
        }

        .pg-thumb-active { outline-color: #0ea5e9; }
        .pg-thumb:hover:not(.pg-thumb-active) { outline-color: #cbd5e1; }

        .pg-thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.2s;
        }

        .pg-thumb:hover img { transform: scale(1.06); }

        @keyframes pgFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .pg-fade { animation: pgFade 0.2s ease; }
      `}</style>

      <div className="pg-root">
        <div
          className={`pg-main ${zoomed ? "pg-main-zoomed" : ""}`}
          onClick={() => setZoomed((z) => !z)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomed(false)}
        >
          <img
            key={active}
            src={list[active]}
            alt={`${name} — view ${active + 1}`}
            className={`pg-img pg-fade ${zoomed ? "pg-img-zoomed" : "pg-img-normal"}`}
            style={
              zoomed
                ? ({
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  } as React.CSSProperties)
                : undefined
            }
            draggable={false}
          />

          {list.length > 1 && (
            <>
              <button
                className="pg-arrow pg-arrow-l"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i - 1 + list.length) % list.length);
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="pg-arrow pg-arrow-r"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i + 1) % list.length);
                }}
                aria-label="Next"
              >
                ›
              </button>
              <span className="pg-counter">
                {active + 1} / {list.length}
              </span>
            </>
          )}
        </div>

        {list.length > 1 && (
          <div className="pg-thumbs">
            {list.map((img, i) => (
              <button
                key={i}
                className={`pg-thumb ${i === active ? "pg-thumb-active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img src={img} alt={`${name} ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
