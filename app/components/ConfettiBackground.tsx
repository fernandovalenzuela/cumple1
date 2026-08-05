"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function ConfettiBackground() {
  return (
    <div className="confetti">
      <DotLottieReact
        src="/animations/confetti.lottie"
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}