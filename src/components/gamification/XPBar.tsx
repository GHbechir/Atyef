"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export function XPBar({ currentXP = 320, maxXP = 500, level = 4 }: Partial<XPBarProps>) {
  const pct = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {/* Level badge */}
      <div className="flex items-center gap-1 shrink-0 bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
        <Zap className="w-3 h-3 text-accent" />
        <span className="text-[10px] font-bold text-accent">Niv. {level}</span>
      </div>

      {/* XP bar */}
      <div className="flex-1 min-w-[80px] max-w-[140px]">
        <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent via-purple-400 to-pink-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
          />
        </div>
      </div>

      {/* XP text */}
      <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:block">
        {currentXP}/{maxXP} XP
      </span>
    </div>
  );
}
