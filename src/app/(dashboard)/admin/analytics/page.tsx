"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Play, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Analytics détaillés</h1>
        <p className="text-muted-foreground text-sm">Analysez l&apos;engagement des utilisateurs et les performances des cours.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement overview */}
        <motion.div
           className="glass-card rounded-xl p-6 flex flex-col"
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white">Temps d&apos;apprentissage global</h3>
              <Badge variant="outline" className="border-white/10 text-muted-foreground">30 Derniers Jours</Badge>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-purple-400" /> Total Heures
                </div>
                <div className="text-2xl font-bold text-white">4,250h</div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +12%</div>
             </div>
             <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                  <Play className="w-4 h-4 text-emerald-400" /> Leçons Vues
                </div>
                <div className="text-2xl font-bold text-white">18,402</div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +8%</div>
             </div>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/3 min-h-[200px]">
              <BarChart3 className="w-10 h-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Graphique Recharts à intégrer ici</p>
           </div>
        </motion.div>

        {/* Top Courses */}
        <motion.div
           className="glass-card rounded-xl p-6"
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Cours les plus performants
              </h3>
           </div>
           
           <div className="space-y-4">
             {[
               { title: "Piano : Les Fondamentaux", views: "12.4k", completion: "85%" },
               { title: "Guitare Acoustique pour Débutants", views: "8.2k", completion: "72%" },
               { title: "Blues Guitar Masterclass", views: "5.6k", completion: "91%" },
               { title: "Batterie Rock : Les Essentiels", views: "4.1k", completion: "64%" },
               { title: "Jazz Piano Avancé", views: "3.2k", completion: "88%" },
             ].map((course, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-white truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.views} vues</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-emerald-400 font-medium">{course.completion}</p>
                    <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Complétion</p>
                  </div>
                </div>
             ))}
           </div>
        </motion.div>
      </div>
    </div>
  );
}
