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
      className="glass-card rounded-xl p-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {subtitle && (
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-heading text-white">{value}</div>
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
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-1">
          {t("welcome")}, Marie 👋
        </h1>
        <p className="text-muted-foreground">
          {t("continue_learning")}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label={t("courses_in_progress") as string}
          value={String(stats.totalCourses)}
          subtitle="+1 this week" // Not localized yet, but we will keep it simple
          color="bg-purple-500/20"
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label={t("lessons_completed") as string}
          value={String(stats.completedLessons)}
          subtitle="+3"
          color="bg-emerald-500/20"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label={t("total_time") as string}
          value={`${Math.round(stats.totalWatchTime / 60)}h`}
          color="bg-blue-500/20"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label={t("current_streak") as string}
          value={`${stats.currentStreak} ${t("days")}`}
          subtitle="🔥"
          color="bg-amber-500/20"
          delay={0.15}
        />
      </div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading text-white">
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

      {/* Weekly Goal */}
      <motion.div
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t("weekly_goal")}</h3>
            <p className="text-xs text-muted-foreground">{t("complete_lessons_goal")}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">3/5 {t("lessons")}</span>
          <span className="text-xs font-medium text-amber-400">60%</span>
        </div>
        <Progress value={60} className="h-2" />
      </motion.div>

      {/* Explore Instruments */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-lg font-bold font-heading text-white mb-4">
          {t("explore_instruments")}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {INSTRUMENTS.map((instrument) => (
            <Link
              key={instrument.id}
              href={`/courses?instrument=${instrument.slug}`}
              className="glass-card rounded-xl p-3 text-center group cursor-pointer"
            >
              <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
                {instrument.icon}
              </span>
              <span className="text-[10px] text-muted-foreground group-hover:text-white transition-colors line-clamp-1">
                {instrument.name.split(" / ")[0]}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
