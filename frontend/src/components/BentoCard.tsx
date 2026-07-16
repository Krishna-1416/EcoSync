"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
  className?: string;
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  delay?: number;
}

export function BentoCard({ className, children, colSpan = 1, rowSpan = 1, delay = 0 }: BentoCardProps) {
  const colSpanClass = {
    1: "col-span-1",
    2: "col-span-1 md:col-span-2",
    3: "col-span-1 md:col-span-3",
    4: "col-span-1 md:col-span-4",
  }[colSpan];

  const rowSpanClass = {
    1: "row-span-1",
    2: "row-span-2",
  }[rowSpan];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ scale: 0.99 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass-panel rounded-3xl p-6 flex flex-col overflow-hidden relative group cursor-pointer transition-colors hover:bg-neutral-900/60",
        colSpanClass,
        rowSpanClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
