"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin sky-blue reading-progress bar pinned above the navbar. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #4A90D9, #2952A3)",
      }}
      aria-hidden="true"
    />
  );
}
