"use client";

import React from "react";
import { ReactLenis, useLenis } from "lenis/react";
const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 10 }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScrolling;
