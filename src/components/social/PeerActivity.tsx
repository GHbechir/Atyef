"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export function PeerActivity() {
  const avatars = ["M", "S", "A", "K"];
  const colors = [
    "bg-emerald-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-rose-500",
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-border/40 mt-4"
    >
      <div className="flex -space-x-2">
        {avatars.map((initial, i) => (
          <div 
            key={i} 
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-background ${colors[i % colors.length]}`}
          >
            {initial}
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-accent" />
          12 apprenants
        </p>
        <p className="text-xs text-muted-foreground">ont terminé cette leçon aujourd'hui</p>
      </div>
    </motion.div>
  );
}
