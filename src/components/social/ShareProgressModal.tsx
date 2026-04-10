"use client";

import { motion } from "framer-motion";
import { Share2, Download, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonName: string;
  instrument: string;
}

export function ShareProgressModal({ isOpen, onClose, lessonName, instrument }: ShareProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/10 text-foreground/60 hover:bg-foreground/20 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Share Card (Spotify Wrapped Style) */}
        <div id="share-card" className="p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-emerald-900 text-white relative overflow-hidden text-center">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center mb-6">
              <Music className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 mb-2">Nouvelle étape franchie</p>
            <h3 className="text-2xl font-bold font-heading mb-1 leading-tight">J'ai terminé</h3>
            <p className="text-lg text-white/90 mb-8 font-medium">"{lessonName}"</p>
            
            <div className="flex items-end justify-between text-left">
              <div>
                <p className="text-xs text-white/60 mb-0.5">Instrument</p>
                <p className="font-semibold text-sm">{instrument}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-heading tracking-tight">Aty<span className="text-accent">ef</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <Button className="w-full h-11 gradient-bg text-white border-0 gap-2 font-semibold">
            <Share2 className="w-4 h-4" /> Partager sur Instagram
          </Button>
          <Button variant="outline" className="w-full h-11 gap-2" onClick={onClose}>
            <Download className="w-4 h-4" /> Enregistrer l'image
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
