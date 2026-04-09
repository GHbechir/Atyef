"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, Music2, Trophy, Target, Edit2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const badges = [
  { name: "Première note", icon: "🎵", earned: true },
  { name: "7 jours de streak", icon: "🔥", earned: true },
  { name: "10 leçons", icon: "📚", earned: true },
  { name: "Maestro", icon: "🎹", earned: false },
  { name: "Virtuose", icon: "⭐", earned: false },
  { name: "Mentor", icon: "🎓", earned: false },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Mon profil</h1>
        <p className="text-muted-foreground text-sm">Gérez vos informations et préférences.</p>
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                ML
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Marie Laurent</h2>
            <p className="text-sm text-muted-foreground">marie.laurent@email.com</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Apprenant
              </Badge>
              <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400 bg-purple-500/10">
                Basic
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" /> Informations personnelles
        </h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Prénom</Label>
              <Input defaultValue="Marie" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Nom</Label>
              <Input defaultValue="Laurent" className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input defaultValue="marie.laurent@email.com" className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Bio</Label>
            <Textarea
              defaultValue="Passionnée de piano et de guitare. J'apprends la musique depuis 6 mois."
              className="bg-white/5 border-white/10 text-white min-h-[80px]"
            />
          </div>
          <Button className="gradient-bg text-white hover:opacity-90 border-0">
            Sauvegarder les modifications
          </Button>
        </form>
      </motion.div>

      {/* Badges */}
      <motion.div
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Mes badges
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`text-center p-3 rounded-xl transition-all ${
                badge.earned
                  ? "glass-card border border-amber-500/20"
                  : "bg-white/3 opacity-40"
              }`}
            >
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <span className="text-[10px] text-muted-foreground leading-tight block">{badge.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Music2 className="w-4 h-4 text-purple-400" /> Mon abonnement
        </h3>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <p className="font-medium text-white">Plan Basic</p>
            <p className="text-sm text-muted-foreground">9,90 €/mois • Prochain renouvellement : 15 Mai 2026</p>
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Passer à VIP
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
