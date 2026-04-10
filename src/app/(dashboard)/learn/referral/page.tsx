"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Copy,
  Check,
  Users,
  ChevronRight,
  Sparkles,
  Crown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const REFERRAL_CODE = "MARIE-8X4Z";
const REFERRAL_LINK = `https://atyef.com/ref/${REFERRAL_CODE}`;

const TIERS = [
  { count: 1, reward: "1 mois offert", icon: "🎁", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
  { count: 3, reward: "3 mois offerts", icon: "🎶", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
  { count: 5, reward: "6 mois offerts", icon: "⭐", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/30" },
  { count: 10, reward: "Accès VIP à vie", icon: "👑", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30" },
];

const MOCK_REFERRALS = [
  { name: "Ahmed B.", status: "converti", date: "Il y a 2 jours", reward: "1 mois offert" },
  { name: "Sana M.", status: "invité", date: "Il y a 5 jours", reward: null },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const convertedCount = MOCK_REFERRALS.filter((r) => r.status === "converti").length;
  const invitedCount = MOCK_REFERRALS.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find next tier
  const nextTier = TIERS.find((t) => t.count > convertedCount) || TIERS[TIERS.length - 1];
  const prevTierCount = TIERS.find((t) => t.count <= convertedCount)?.count ?? 0;
  const progress = ((convertedCount - prevTierCount) / (nextTier.count - prevTierCount)) * 100;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold font-heading text-foreground">Programme de Parrainage</h1>
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Actif
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Invitez vos amis musiciens et gagnez des mois gratuits ensemble.
        </p>
      </motion.div>

      {/* How it works */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Gift className="w-4 h-4 text-accent" /> Comment ça marche
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { step: "1", title: "Partagez votre lien", desc: "Envoyez votre lien unique à vos amis musiciens.", icon: "🔗" },
            { step: "2", title: "Ils s'inscrivent", desc: "Votre ami bénéficie de 14 jours d'essai au lieu de 7.", icon: "🎵" },
            { step: "3", title: "Vous êtes récompensés", desc: "Dès qu'il souscrit, vous recevez 1 mois offert.", icon: "🎁" },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-foreground/[0.02] border border-border/40">
              <span className="text-3xl">{item.icon}</span>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referral Link Card */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Votre lien de parrainage
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-foreground/5 border border-border rounded-xl px-4 py-3 font-mono text-sm text-foreground/80 truncate select-all">
            {REFERRAL_LINK}
          </div>
          <Button
            onClick={handleCopy}
            className={`shrink-0 rounded-xl transition-all duration-300 gap-2 ${
              copied
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "gradient-bg text-white border-0 glow-accent"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié !" : "Copier"}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">Code :</span>
          <code className="text-xs font-mono font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-md">{REFERRAL_CODE}</code>
        </div>
      </motion.div>

      {/* Stats + Progress */}
      <motion.div
        className="grid sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="stat-card p-5 text-center">
          <div className="text-3xl font-bold font-heading text-foreground">{invitedCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Amis invités</div>
        </div>
        <div className="stat-card p-5 text-center">
          <div className="text-3xl font-bold font-heading text-emerald-400">{convertedCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Convertis</div>
        </div>
        <div className="stat-card p-5 text-center">
          <div className="text-3xl font-bold font-heading text-accent">{convertedCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Mois gagnés</div>
        </div>
      </motion.div>

      {/* Tiers */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" /> Paliers de récompenses
        </h2>
        <div className="space-y-3">
          {TIERS.map((tier) => {
            const isReached = convertedCount >= tier.count;
            const isCurrent = nextTier.count === tier.count;
            return (
              <div
                key={tier.count}
                className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r border transition-all ${tier.color} ${tier.border} ${
                  isReached ? "opacity-100" : isCurrent ? "ring-1 ring-accent/30" : "opacity-50"
                }`}
              >
                <span className="text-2xl">{tier.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{tier.reward}</p>
                  <p className="text-xs text-muted-foreground">{tier.count} filleul{tier.count > 1 ? "s" : ""} converti{tier.count > 1 ? "s" : ""}</p>
                </div>
                {isReached ? (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs">Atteint ✓</Badge>
                ) : isCurrent ? (
                  <div className="text-right">
                    <Badge variant="outline" className="border-accent/30 text-accent text-xs mb-1">En cours</Badge>
                    <div className="w-24 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-purple-400 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* History */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" /> Historique des invitations
        </h2>
        {MOCK_REFERRALS.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucune invitation envoyée pour l'instant. Partagez votre lien !
          </p>
        ) : (
          <div className="divide-y divide-border/40">
            {MOCK_REFERRALS.map((ref, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-purple-500/30 flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                  {ref.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{ref.name}</p>
                  <p className="text-xs text-muted-foreground">{ref.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 ${
                      ref.status === "converti"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {ref.status === "converti" ? "✓ Converti" : "⏳ Invité"}
                  </Badge>
                  {ref.reward && (
                    <p className="text-[10px] text-emerald-400 mt-0.5">{ref.reward}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
