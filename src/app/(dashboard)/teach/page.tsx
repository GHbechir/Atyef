"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Eye,
  CreditCard,
  TrendingUp,
  PlusCircle,
  MoreVertical,
  Play,
  Clock,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TEACHER_STATS, FEATURED_COURSES } from "@/lib/mock-data";
import { useLanguage } from "@/contexts/LanguageContext";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
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
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend && (
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-2.5 h-2.5" /> {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-heading text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

const teacherCourses = FEATURED_COURSES.slice(0, 4).map((c, i) => ({
  ...c,
  students: [342, 156, 89, 45][i],
  views: [12450, 5620, 3200, 890][i],
  published: i < 3,
  revenue: [2150, 980, 650, 0][i],
}));

const recentStudents = [
  { name: "Lucas Martin", course: "Piano : Les Fondamentaux", progress: 85, lastActive: "Il y a 2h" },
  { name: "Emma Petit", course: "Piano : Les Fondamentaux", progress: 42, lastActive: "Il y a 5h" },
  { name: "Hugo Dubois", course: "Blues Guitar Masterclass", progress: 65, lastActive: "Hier" },
  { name: "Léa Moreau", course: "Jazz Piano Avancé", progress: 23, lastActive: "Il y a 2 jours" },
];

export default function TeacherDashboard() {
  const stats = TEACHER_STATS;
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-1">
            {t("teacher_space")} 🎓
          </h1>
          <p className="text-muted-foreground">
            {t("manage_courses_subtitle")}
          </p>
        </div>
        <Link href="/teach/courses/new">
          <Button className="gradient-bg text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t("new_course")}
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label={t("enrolled_students") as string} value={String(stats.totalStudents)} trend="+12%" color="bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/20" delay={0} />
        <StatCard icon={BookOpen} label={t("published_courses") as string} value={String(stats.totalCourses)} color="bg-gradient-to-br from-blue-500/30 to-blue-500/10 border border-blue-500/20" delay={0.05} />
        <StatCard icon={Eye} label={t("total_views") as string} value={stats.totalViews.toLocaleString("fr-FR")} trend="+8%" color="bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/20" delay={0.1} />
        <StatCard icon={CreditCard} label={t("revenue_this_month") as string} value={`${stats.totalRevenue} €`} trend="+15%" color="bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-500/20" delay={0.15} />
      </div>

      {/* My Courses */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold font-heading text-foreground">{t("my_courses")}</h2>
          <Link href="/teach/courses">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white group">
              {t("see_all")} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {teacherCourses.map((course, i) => (
            <div key={course.id} className="glass-card rounded-xl p-4 flex items-center gap-4 group">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${course.instrument.color}30, ${course.instrument.color}10)` }}
              >
                <Play className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${course.published ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"}`}>
                    {course.published ? t("published") : t("draft")}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{course.views.toLocaleString("fr-FR")}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessonCount} {t("lessons")}</span>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-semibold text-white">{course.revenue} €</p>
                <p className="text-xs text-muted-foreground">ce mois</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-white shrink-0 rounded-md hover:bg-white/5 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem>Voir les analytics</DropdownMenuItem>
                  <DropdownMenuItem>{course.published ? "Dépublier" : "Publier"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Students */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading text-white">{t("recent_activity")}</h2>
          <Link href="/teach/students">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white group">
              {t("all_students")} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {recentStudents.map((student, i) => {
            const avatarColors = [
              "from-purple-500 to-violet-600",
              "from-pink-500 to-rose-500",
              "from-blue-500 to-cyan-500",
              "from-emerald-500 to-teal-500",
            ];
            return (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-foreground/[0.02] transition-colors">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md`}>
                  {student.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{student.course}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-20 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-purple-400 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{student.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{student.lastActive}</p>
                </div>
              </div>
            );
          })}</div>
        </div>
      </motion.div>
    </div>
  );
}
