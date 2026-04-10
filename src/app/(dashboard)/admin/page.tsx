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
  UserCheck,
  Video
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ADMIN_STATS } from "@/lib/mock-data";
import { useLanguage } from "@/contexts/LanguageContext";

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
      className="stat-card p-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <Badge
          variant="outline"
          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 border-0 rounded-full ${
            trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {trendUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {trend}
        </Badge>
      </div>
      <div className="text-2xl font-bold font-heading text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const stats = ADMIN_STATS;
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">
          {t("admin_overview")} 👑
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("admin_overview_subtitle")}
        </p>
      </motion.div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={DollarSign}
          label={t("mrr") as string}
          value={`${(stats.totalRevenue).toLocaleString("fr-FR")} €`}
          trend="12.5%"
          trendUp={true}
          color="bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-500/20"
          delay={0}
        />
        <AdminStatCard
          icon={Users}
          label={t("total_users") as string}
          value={stats.totalUsers.toLocaleString("fr-FR")}
          trend="5.2%"
          trendUp={true}
          color="bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/20"
          delay={0.05}
        />
        <AdminStatCard
          icon={CreditCard}
          label={t("active_subscriptions") as string}
          value={stats.activeSubscriptions.toLocaleString("fr-FR")}
          trend="8.1%"
          trendUp={true}
          color="bg-gradient-to-br from-blue-500/30 to-blue-500/10 border border-blue-500/20"
          delay={0.1}
        />
        <AdminStatCard
          icon={Activity}
          label={t("retention_rate") as string}
          value={`${stats.retentionRate}%`}
          trend="1.2%"
          trendUp={false}
          color="bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/20"
          delay={0.15}
        />
      </div>

      {/* Secondary KPI Grid for Feedbacks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminStatCard
          icon={Video}
          label={t("student_videos_received") as string}
          value="1,245"
          trend="18%"
          trendUp={true}
          color="bg-blue-500/20 text-blue-400"
          delay={0.18}
        />
        <AdminStatCard
          icon={UserCheck}
          label={t("teacher_feedbacks_completed") as string}
          value="94%"
          trend="2%"
          trendUp={true}
          color="bg-emerald-500/20 text-emerald-400"
          delay={0.2}
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
              <UserCheck className="w-4 h-4 text-purple-400" /> {t("user_distribution")}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{t("learners")}</span>
                  <span className="font-medium text-white">{stats.totalLearners}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{t("teachers")}</span>
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
              <BookOpen className="w-4 h-4 text-blue-400" /> {t("global_content")}
            </h3>
             <div className="space-y-3">
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                 <span className="text-sm text-muted-foreground">{t("published_courses")}</span>
                 <span className="text-sm font-semibold text-white">{stats.totalCourses}</span>
               </div>
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                 <span className="text-sm text-muted-foreground">{t("video_lessons")}</span>
                 <span className="text-sm font-semibold text-white">1 452</span>
               </div>
                <div className="flex items-center justify-between">
                 <span className="text-sm text-muted-foreground">{t("content_hours")}</span>
                 <span className="text-sm font-semibold text-white">450h+</span>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Sparkline Chart */}
        <motion.div
           className="lg:col-span-2 stat-card p-6 flex flex-col"
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.25 }}
        >
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground">{t("revenue_growth")}</h3>
              <Badge variant="outline" className="border-border/60 text-muted-foreground text-xs">{t("last_30_days")}</Badge>
           </div>
           
           {/* CSS Sparkline */}
           <div className="flex-1 flex flex-col justify-end">
             <div className="sparkline">
               {[35, 45, 30, 60, 55, 70, 65, 80, 72, 90, 85, 95].map((h, i) => (
                 <div
                   key={i}
                   className="sparkline-bar"
                   style={{
                     height: `${h}%`,
                     animationDelay: `${i * 0.05}s`,
                     background: i === 11
                       ? `oklch(0.58 0.22 290 / 0.9)`
                       : `oklch(0.58 0.22 290 / ${0.2 + (i / 11) * 0.5})`,
                   }}
                 />
               ))}
             </div>
             <div className="flex justify-between mt-3">
               {["Jan","","Fév","","Mar","","Avr","","Mai","","Juin",""].map((m, i) => (
                 <span key={i} className="text-[9px] text-muted-foreground/50">{m}</span>
               ))}
             </div>
           </div>

           <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-6">
             <div>
               <p className="text-xs text-muted-foreground">Ce mois</p>
               <p className="text-lg font-bold text-foreground">{stats.totalRevenue.toLocaleString("fr-FR")} €</p>
             </div>
             <div>
               <p className="text-xs text-muted-foreground">Croissance</p>
               <p className="text-lg font-bold text-emerald-400">+12.5%</p>
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
