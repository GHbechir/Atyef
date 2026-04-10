"use client";

import { useState } from "react";
import { X, Gift, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ReferralBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mx-3 mb-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-accent/15 to-purple-500/10 border border-accent/20 relative overflow-hidden">
      {/* Shimmer */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-2.5 pr-4">
        <span className="text-xl mt-0.5">🎁</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground mb-0.5">
            Invitez un ami, gagnez 1 mois !
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
            Partagez votre lien unique et profitez de mois gratuits.
          </p>
          <Link
            href="/learn/referral"
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            <Gift className="w-3 h-3" />
            Voir mon programme
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
