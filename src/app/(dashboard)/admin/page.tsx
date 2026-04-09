"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ADMIN_STATS } from "@/lib/mock-data";

function AdminStatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="glass-card rounded-xl p-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <Badge
          variant="outline"
          className={`flex items-center gap-1 text-[10px] px-1.5 py-0 border-0 ${
            trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </Badge>
      </div>
      <div className="text-2xl font-bold font-heading text-white">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const stats = ADMIN_STATS;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">
          Vue d&apos;ensemble Admin 👑
        </h1>
        <p className="text-muted-foreground text-sm">
          Aperçu global des performances de la plateforme Atyef.
        </p>
      </motion.div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={DollarSign}
          label="Revenus Mensuels (MRR)"
          value={`${(stats.totalRevenue).toLocaleString("fr-FR")} €`}
          trend="12.5%"
          trendUp={true}
          color="bg-emerald-500/20 text-emerald-400"
          delay={0}
        />
        <AdminStatCard
          icon={Users}
          label="Utilisateurs Totaux"
          value={stats.totalUsers.toLocaleString("fr-FR")}
          trend="5.2%"
          trendUp={true}
          color="bg-purple-500/20 text-purple-400"
          delay={0.05}
        />
        <AdminStatCard
          icon={CreditCard}
          label="Abonnements Actifs"
          value={stats.activeSubscriptions.toLocaleString("fr-FR")}
          trend="8.1%"
          trendUp={true}
          color="bg-blue-500/20 text-blue-400"
          delay={0.1}
        />
        <AdminStatCard
          icon={Activity}
          label="Taux de Rétention"
          value={`${stats.retentionRate}%`}
          trend="1.2%"
          trendUp={false}
          color="bg-amber-500/20 text-amber-400"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secondary Stats */}
        <motion.div
          className="lg:col-span-1 space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-purple-400" /> Répartition Utilisateurs
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Apprenants</span>
                  <span className="font-medium text-white">{stats.totalLearners}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Professeurs</span>
                  <span className="font-medium text-white">{stats.totalTeachers}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '2%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-blue-400" /> Contenu Global
            </h3>
             <div className="space-y-3">
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                 <span className="text-sm text-muted-foreground">Cours publiés</span>
                 <span className="text-sm font-semibold text-white">{stats.totalCourses}</span>
               </div>
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                 <span className="text-sm text-muted-foreground">Leçons vidéos</span>
                 <span className="text-sm font-semibold text-white">1 452</span>
               </div>
                <div className="flex items-center justify-between">
                 <span className="text-sm text-muted-foreground">Heures de contenu</span>
                 <span className="text-sm font-semibold text-white">450h+</span>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Charts / Main Activity Area (Placeholder for MVP) */}
        <motion.div
           className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col"
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.25 }}
        >
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white">Croissance des Revenus (MRR)</h3>
              <Badge variant="outline" className="border-white/10 text-muted-foreground">30 Derniers Jours</Badge>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/3 min-h-[300px]">
              <TrendingUp className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Graphique Recharts à intégrer ici</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Évolution des abonnements au fil du temps</p>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
