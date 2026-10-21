"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

type GalleryItem = {
  id: number;
  picture: string;
  thumbnail?: string;
  description?: string;
};

const AUTOPLAY_MS = 3000;
const UI_HIDE_MS = 2000;

export default function Gallery({
  items,
  editing = false,
}: {
  items: GalleryItem[];
  editing?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showUI, setShowUI] = useState(true);
  const [isHolding, setIsHolding] = useState(false);

  const [translateX, setTranslateX] = useState(0);
  const isDragging = useRef(false);

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selected =
    selectedIndex !== null ? items[selectedIndex] : null;

    /*if (items) {
      items.forEach((item) => {console.log("FOTO! ",item.picture);console.log("FOTO! ",item.id); }); 
    }*/

  /* =========================
     IMMERSIVE
  ========================= */
  useEffect(() => {
    document.body.style.overflow =
      selectedIndex !== null ? "hidden" : "auto";
  }, [selectedIndex]);

  /* =========================
     NAV
  ========================= */
  const next = () => {
    setSelectedIndex((prev) =>
      prev !== null
        ? prev < items.length - 1
          ? prev + 1
          : 0
        : null
    );
    setScale(1);
    setProgress(0);
  };

  const prev = () => {
    setSelectedIndex((prev) =>
      prev !== null
        ? prev > 0
          ? prev - 1
          : items.length - 1
        : null
    );
    setScale(1);
    setProgress(0);
  };

  /* =========================
     AUTOPLAY
  ========================= */
  useEffect(() => {
    if (selectedIndex === null || isHolding) return;

    const start = Date.now();

    intervalRef.current = setInterval(() => {
      const pct = Math.min(
        (Date.now() - start) / AUTOPLAY_MS,
        1
      );

      setProgress(pct);

      if (pct === 1) next();
    }, 50);

    return () => clearInterval(intervalRef.current!);
  }, [selectedIndex, isHolding]);

  /* =========================
     UI AUTO HIDE
  ========================= */
  const resetUI = () => {
    setShowUI(true);

    clearTimeout(uiTimeoutRef.current!);

    uiTimeoutRef.current = setTimeout(() => {
      setShowUI(false);
    }, UI_HIDE_MS);
  };

  useEffect(() => {
    if (selectedIndex !== null) resetUI();
  }, [selectedIndex]);

  /* =========================
     PREFETCH
  ========================= */
  useEffect(() => {
    if (selectedIndex === null) return;

    const nextIndex =
      selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;

    const prevIndex =
      selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;

    [nextIndex, prevIndex].forEach((i) => {
      const img = new window.Image();
      img.src = items[i].picture;
    });
  }, [selectedIndex]);

  /* =========================
     TOUCH
  ========================= */
  const handleTouchStart = (e: React.TouchEvent) => {
    resetUI();
    setIsHolding(true);

    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;

    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX.current) return;

    const dx = e.touches[0].clientX - startX.current;

    if (scale === 1) {
      setTranslateX(dx);
    }

    const dy = e.touches[0].clientY - startY.current!;

    if (dy > 120) setSelectedIndex(null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHolding(false);

    const dx = translateX;
    const threshold = 80;

    if (dx < -threshold) next();
    else if (dx > threshold) prev();
    else {
      const x = e.changedTouches[0].clientX;
      const width = window.innerWidth;

      if (x < width * 0.33) prev();
      else if (x > width * 0.66) next();
    }

    setTranslateX(0);
    isDragging.current = false;
  };

  if (!items?.length && !editing) return null;

  return (
    <>
      {/* =========================
          GRID RESPONSIVE MEJORADO
      ========================= */}
      <div>

        {items && items.length > 0 && (
        <>
        {/* MOBILE */}
        <div className="flex gap-4 overflow-x-auto px-4 md:hidden">
          
          {items.map((img, i) => (
            <div
              key={img.id}
              className="relative min-w-[80%] h-[260px] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedIndex(i)}
            >
              <Image
                src={img.thumbnail || img.picture}
                alt=""
                fill
                sizes="80vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
          {items.map((img, i) => (
            <div
              key={img.id}
              className="relative w-full h-[300px] lg:h-[360px] rounded-xl overflow-hidden cursor-pointer group shadow-md"
              onClick={() => setSelectedIndex(i)}
            >
              <Image
                src={img.thumbnail || img.picture}
                alt=""
                fill
                sizes="(max-width:768px) 80vw, (max-width:1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        </>
        )}
        {items && items.length === 0 && editing && (
          <p className="text-gray-500 text-center">
            No hay imágenes en la galería. Agrega algunas para que se muestren aquí.
          </p>
        )}
      </div>

      {/* =========================
          MODAL
      ========================= */}
      {selected && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* CLICK PARA CERRAR */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedIndex(null)}
          />

          {/* PROGRESS */}
          {showUI && (
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {items.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/30">
                  <div
                    className="h-full bg-white"
                    style={{
                      width:
                        i === selectedIndex
                          ? `${progress * 100}%`
                          : i < selectedIndex!
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* IMAGE */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <div className="relative w-full max-w-5xl h-[80vh]">
              <Image
                src={selected.picture}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  transition: isDragging.current
                    ? "none"
                    : "transform 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* 🔵 DOTS (AGREGADO) */}
            {showUI && (
            <div className="absolute bottom-6 w-full flex justify-center gap-2 z-10">
                {items.map((_, i) => (
                <div
                    key={i}
                    onClick={() => {
                    setSelectedIndex(i);
                    setScale(1);
                    setProgress(0);
                    }}
                    className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all"
                    style={{
                    background:
                        i === selectedIndex
                        ? "white"
                        : "rgba(255,255,255,0.4)",
                    transform:
                        i === selectedIndex ? "scale(1.4)" : "scale(1)",
                    
              
                    }}
                />
                ))}
            </div>
          )}

          {/* DESCRIPTION */}
          {showUI && selected.description && (
            <p className="absolute bottom-16 text-white text-center w-full px-4 z-10">
              {selected.description}
            </p>
          )}

          {/* ❌ BOTÓN CIERRE MEJORADO */}
          {true && (
            <button
              onClick={() => setSelectedIndex(null)}
              className="
                absolute top-6 right-4 z-20
                w-12 h-12
                rounded-full
                bg-black/60
                backdrop-blur
                text-white text-2xl
                flex items-center justify-center
                active:scale-90
              "
            >
              ✕
            </button>
          )}
        </div>
      ,document.body)}
    </>
  );
}