"use client";

import React from "react";
import { ReactLenis } from "lenis/react";
const SmoothScrolling = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.1 }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScrolling;
