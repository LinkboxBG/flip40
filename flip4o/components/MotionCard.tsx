"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  highlight?: boolean;
  lift?: boolean;
}

export function MotionCard({
  children,
  className = "",
  id,
  style,
  highlight = false,
  lift = true,
}: MotionCardProps) {
  return (
    <motion.div
      id={id}
      style={style}
      className={`card ${highlight ? "card--highlight" : ""} ${className}`.trim()}
      whileHover={lift ? { y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
