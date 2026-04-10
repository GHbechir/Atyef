"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Flame,
  TrendingUp,
  Play,
  ChevronRight,
  Target,
  CheckCircle2,
  Music2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LEARNER_STATS, MOCK_ENROLLED_COURSES, DEMO_LESSONS, INSTRUMENTS } from "@/lib/mock-data";
import { useLanguage } from "@/contexts/LanguageContext";

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="stat-card p-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        {subtitle && (
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-2.5 h-2.5" />
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-heading text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export default function LearnerDashboard() {
  const stats = LEARNER_STATS;
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-1">
          {t("welcome")}, Marie 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("continue_learning")}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label={t("courses_in_progress") as string}
          value={String(stats.totalCourses)}
          subtitle="+1"
          color="bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/20"
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label={t("lessons_completed") as string}
          value={String(stats.completedLessons)}
          subtitle="+3"
          color="bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-500/20"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label={t("total_time") as string}
          value={`${Math.round(stats.totalWatchTime / 60)}h`}
          color="bg-gradient-to-br from-blue-500/30 to-blue-500/10 border border-blue-500/20"
          delay={0.1}
        />
        <div className="relative group">
          {stats.currentStreak >= 5 && (
            <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl transition-all duration-500 group-hover:bg-amber-500/30" />
          )}
          <StatCard
            icon={Flame}
            label={t("current_streak") as string}
            value={`${stats.currentStreak} ${t("days")}`}
            subtitle={stats.currentStreak >= 5 ? "🔥 On Fire!" : "🔥"}
            color={stats.currentStreak >= 5 
              ? "bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-400/50 shadow-lg shadow-amber-500/20" 
              : "bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/20"}
            delay={0.15}
          />
        </div>
      </div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-heading text-foreground">
            {t("resume_learning")}
          </h2>
          <Link href="/learn/courses">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white group">
              {t("see_all")}
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Current Course Card - Featured */}
        <div className="glass-card rounded-2xl p-6 mb-4 border border-purple-500/20">
          <div className="flex flex-col sm:flex-row gap-5">
            <div
              className="w-full sm:w-48 h-32 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${MOCK_ENROLLED_COURSES[0].instrument.color}30, ${MOCK_ENROLLED_COURSES[0].instrument.color}10)` }}
            >
              <Play className="w-10 h-10 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: MOCK_ENROLLED_COURSES[0].instrument.color || "#6C3CE1" }} />
                <span className="text-xs text-muted-foreground">{MOCK_ENROLLED_COURSES[0].instrument.name.split(" / ")[0]}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400">
                  En cours
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {MOCK_ENROLLED_COURSES[0].title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                {t("next_lesson")} : Premiers Accords Majeurs
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">{t("progress")}</span>
                    <span className="text-xs font-medium text-white">{MOCK_ENROLLED_COURSES[0].progress}%</span>
                  </div>
                  <Progress value={MOCK_ENROLLED_COURSES[0].progress || 0} className="h-2" />
                </div>
                <Link href="/learn/courses/1/lessons/l3">
                  <Button size="sm" className="gradient-bg text-white hover:opacity-90 border-0 group shrink-0">
                    {t("continue_btn")}
                    <Play className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Other Courses */}
        <div className="grid sm:grid-cols-2 gap-4">
          {MOCK_ENROLLED_COURSES.slice(1).map((course) => (
            <div key={course.id} className="glass-card rounded-xl p-4 group cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: course.instrument.color || "#6C3CE1" }} />
                <span className="text-xs text-muted-foreground">{course.instrument.name.split(" / ")[0]}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {course.title}
              </h3>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{t("progress")}</span>
                <span className="text-xs font-medium text-white">{course.progress}%</span>
              </div>
              <Progress value={course.progress || 0} className="h-1.5" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Goal - Streak Dots */}
      <motion.div
        className="stat-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Target className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("weekly_goal")}</h3>
            <p className="text-xs text-muted-foreground">{t("complete_lessons_goal")}</p>
          </div>
          <div className="ml-auto text-xs font-semibold text-amber-400">3/5</div>
        </div>
        {/* Day-dot tracker */}
        <div className="flex items-center gap-2 mb-3">
          {["L","M","M","J","V","S","D"].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-full h-1.5 rounded-full transition-all ${
                i < 3 ? "bg-amber-400" : "bg-foreground/10"
              }`} />
              <span className="text-[9px] text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Rewards & Badges (Gamification) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-heading text-foreground">
            Mes Badges
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { id: 1, name: "Débutant", icon: "🌱", desc: "1ère leçon", unlocked: true },
            { id: 2, name: "Mélodiste", icon: "🥉", desc: "5 leçons", unlocked: true },
            { id: 3, name: "Harmoniste", icon: "🥈", desc: "10 leçons", unlocked: false },
            { id: 4, name: "Virtuose", icon: "🥇", desc: "25 leçons", unlocked: false },
          ].map((badge) => (
            <div 
              key={badge.id} 
              className={`stat-card p-4 text-center flex flex-col items-center gap-2 transition-all duration-300 ${badge.unlocked ? 'hover:scale-105 border-accent/20 bg-accent/5' : 'opacity-60 grayscale'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${badge.unlocked ? 'bg-gradient-to-br from-accent/20 to-purple-500/20 shadow-lg shadow-accent/10' : 'bg-foreground/5'}`}>
                {badge.icon}
              </div>
              <div>
                <p className={`text-sm font-bold ${badge.unlocked ? 'text-accent' : 'text-foreground'}`}>{badge.name}</p>
                <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Explore Instruments */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-lg font-semibold font-heading text-foreground mb-4">
          {t("explore_instruments")}
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2.5">
          {INSTRUMENTS.map((instrument) => (
            <Link
              key={instrument.id}
              href={`/courses?instrument=${instrument.slug}`}
              className="stat-card p-3 text-center group cursor-pointer flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl block group-hover:scale-125 transition-transform duration-300">
                {instrument.icon}
              </span>
              <span className="text-[9px] text-muted-foreground group-hover:text-accent transition-colors line-clamp-1">
                {instrument.name.split(" / ")[0]}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
