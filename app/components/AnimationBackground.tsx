"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function AnimationBackground({ animationType = 0 }) {
  //console.log("animationType:", animationType);
  if (animationType === 0) return null;

  let src = "";

  

  switch (animationType) {
    case 1:
      src = "/animations/confetti.lottie";
      break;
    case 2:
      src = "/animations/balloons.lottie";
      break;
    case 3:
      src = "/animations/sparkles.lottie";
      break;
    default:
      return null;
  }

  return (
    <DotLottieReact
      src={src}
      loop
      autoplay
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: "var(--hero-animation-opacity, 0.3)",
        filter: "blur(var(--hero-animation-blur, 0px))",
        transform: "scale(var(--hero-animation-scale, 1))",
      }}
    />
  );
}