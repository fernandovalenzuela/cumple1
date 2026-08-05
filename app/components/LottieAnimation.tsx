"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LottieAnimation() {
  return (
    <DotLottieReact
      src="/animations/confetti.lottie"
      loop
      autoplay
      style={{ width: 400, height: 400 }}
    />
  );
}