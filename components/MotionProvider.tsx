"use client";

import { MotionConfig } from "framer-motion";

/** Disables Framer Motion animations for users with prefers-reduced-motion. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
