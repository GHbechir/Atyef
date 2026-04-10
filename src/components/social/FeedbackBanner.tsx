"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedbackBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md bg-amber-500/10 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl p-3 flex items-center justify-between"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 animate-shimmer pointer-events-none rounded-2xl" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center relative">
            <Video className="w-5 h-5 text-amber-500" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-500">Nouveau Feedback Vidéo !</p>
            <p className="text-xs text-amber-500/80">Votre prof. a répondu à votre vidéo.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 relative z-10">
          <Button size="sm" variant="ghost" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8 px-2 text-xs">
            Voir <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
          <button onClick={() => setIsVisible(false)} className="p-1.5 text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
