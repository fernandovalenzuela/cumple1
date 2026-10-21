"use client";

import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getAnimationInfo } from "@/lib/appearance";

export function AnimationBackground({ animationType = 0 }: { animationType?: number }) {
  const aniInfo = getAnimationInfo(animationType);

  // Estados locales expresados en porcentajes (%)
  const [topPercent, setTopPercent] = useState(0);
  const [leftPercent, setLeftPercent] = useState(50);
  const [widthPercent, setWidthPercent] = useState(100);
  const [heightPercent, setHeightPercent] = useState(100);
  
  // Opciones de estilo adicionales
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0.5);
  const [blur, setBlur] = useState(0);

  // Muestra un panel para cambiar top, left, height, opacity y ver en vivo como queda la animacion. Debe estar en true para que se muestre ese panel.
  const showConfigPanel: boolean = false;

  // Sincronizar el estado local cuando cambia la animación seleccionada
  useEffect(() => {
    if (aniInfo) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      
      const rawTop = isMobile ? aniInfo.mobileTopValue : aniInfo.desktopTopValue;
      const rawLeft = isMobile ? aniInfo.mobileLeftValue : aniInfo.desktopLeftValue;

      const width = isMobile ? aniInfo.mobileWidth : aniInfo.desktopWidth;
      const height = isMobile ? aniInfo.mobileHeight : aniInfo.desktopHeight;

      setTopPercent(parseFloat(rawTop) || 0);
      setLeftPercent(parseFloat(rawLeft) || 50);
      setWidthPercent(parseInt(width) || 100);
      setHeightPercent(parseInt(height) || 100);
      setOpacity(Number(aniInfo.opacity) || 0.5);

      const blurMatch = aniInfo.filter?.match(/blur\((\d+)px\)/);
      setBlur(blurMatch ? Number(blurMatch[1]) : 0);

      setScale(1);
    }
  }, [animationType]);

  if (animationType === 0) return null;

  // Lógica de centrado automático si Left está en 50%
  const isCentered = leftPercent === 50;
  const translatePart = isCentered ? "translateX(-50%)" : "";
  const scalePart = scale !== 1 ? `scale(${scale})` : "";
  const transformValue = `${translatePart} ${scalePart}`.trim();

  const filterValue = blur > 0 ? `blur(${blur}px)` : "";

  // Copia segura de la configuración optimizada para responsive (%)
  const handleCopyValues = () => {
    const textToCopy = `    mobileTopValue: "${topPercent}%",
    desktopTopValue: "${topPercent}%",
    mobileLeftValue: "${leftPercent}%",
    desktopLeftValue: "${leftPercent}%",
    opacity: "${opacity}",
    width: "${widthPercent}%",
    height: "${heightPercent}%",
    filter: "${filterValue}",
    transform: "${transformValue}",`;

    console.log("--- VALORES EN PORCENTAJE PARA appearance.ts ---");
    console.log(textToCopy);

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert("¡Valores en % copiados al portapapeles!"))
        .catch(() => alert("Mira la consola (F12) para copiar los valores."));
    } else {
      //alert("Configuración impresa en la consola (F12) por seguridad.");
    }
  };

  return (
    <>
      <DotLottieReact
        key={`${animationType}-${topPercent}-${leftPercent}-${scale}-${widthPercent}-${heightPercent}-${blur}`}
        src={aniInfo.file}
        loop
        autoplay
        speed={Number(aniInfo.speed)}
        style={{
          width: `${widthPercent}%`,
          height: `${heightPercent}%`,
          position: "absolute",
          top: `${topPercent}%`,
          left: `${leftPercent}%`,
          pointerEvents: "none",
          opacity: opacity,
          filter: filterValue,
          transform: transformValue || undefined,
        }}
      />

      {/* 🛠️ PANEL DE CALIBRACIÓN PORCENTUAL */}
      { showConfigPanel && 
      <div 
        className="fixed bottom-2 right-2 z-[999999] bg-white text-gray-900 p-4 rounded-xl text-xs space-y-2.5 shadow-2xl border-2 border-slate-900 w-80 pointer-events-auto"
        style={{ position: "fixed", color: "#000000" }}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <p className="font-bold text-violet-700 text-sm">Calibrador % ({aniInfo.label})</p>
          <span className="text-[10px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono border border-gray-300">
            ID: {animationType}
          </span>
        </div>
        
        {/* Top (%) */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Top:</label>
          <input 
            type="range" 
            min="-50" 
            max="150" 
            value={topPercent} 
            onChange={(e) => setTopPercent(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{topPercent}%</span>
        </div>

        {/* Left (%) */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Left:</label>
          <input 
            type="range" 
            min="-50" 
            max="150" 
            value={leftPercent} 
            onChange={(e) => setLeftPercent(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{leftPercent}%</span>
        </div>

        {/* Width (%) */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Width:</label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            value={widthPercent} 
            onChange={(e) => setWidthPercent(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{widthPercent}%</span>
        </div>

        {/* Height (%) */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Height:</label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            value={heightPercent} 
            onChange={(e) => setHeightPercent(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{heightPercent}%</span>
        </div>

        {/* Escala (Multiplicador) */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Escala:</label>
          <input 
            type="range" 
            min="0.2" 
            max="3" 
            step="0.1" 
            value={scale} 
            onChange={(e) => setScale(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{scale}x</span>
        </div>

        {/* Opacidad */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Opacidad:</label>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.05" 
            value={opacity} 
            onChange={(e) => setOpacity(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{opacity}</span>
        </div>

        {/* Blur */}
        <div className="flex items-center justify-between gap-2">
          <label className="w-16 font-semibold text-gray-900">Blur:</label>
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={blur} 
            onChange={(e) => setBlur(Number(e.target.value))} 
            className="w-full accent-violet-600 cursor-pointer"
          />
          <span className="w-12 text-right font-mono font-bold text-gray-900">{blur}px</span>
        </div>

        <button 
          type="button"
          onClick={handleCopyValues}
          className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 py-2 rounded-lg font-bold text-white mt-2 transition-colors shadow-md text-xs cursor-pointer"
        >
          📋 Copiar Configuración (%)
        </button>
      </div> }
    </>
  );
}