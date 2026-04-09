"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Clock,
  BookOpen,
  Award,
  Download,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Star,
  Users,
  FileText,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FEATURED_COURSES, DEMO_LESSONS } from "@/lib/mock-data";

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    BEGINNER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    INTERMEDIATE: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    ADVANCED: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  const labels: Record<string, string> = {
    BEGINNER: "Débutant",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  // In real app, fetch from API
  const course = FEATURED_COURSES.find((c) => c.slug === slug) || FEATURED_COURSES[0];
  const lessons = DEMO_LESSONS;
  const completedCount = lessons.filter((l) => l.completed).length;
  const totalDuration = lessons.reduce((acc, l) => acc + l.duration, 0);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux cours
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: course.instrument.color || "#6C3CE1" }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {course.instrument.name}
                </span>
                <LevelBadge level={course.level} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {course.description}
              </p>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                    {course.teacher.firstName?.[0]}
                  </div>
                  <span>
                    {course.teacher.firstName} {course.teacher.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {lessons.length} leçons
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {Math.round(totalDuration / 60)} min
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  4.8 (124 avis)
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  342 élèves
                </div>
              </div>
            </motion.div>

            {/* Video Preview */}
            <motion.div
              className="relative rounded-2xl overflow-hidden mb-8 aspect-video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br"
                style={{
                  background: `linear-gradient(135deg, ${course.instrument.color || "#6C3CE1"}30, ${course.instrument.color || "#6C3CE1"}10)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform group">
                  <Play className="w-8 h-8 text-white ml-1 group-hover:text-purple-300 transition-colors" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-black/50 backdrop-blur text-white border-white/10">
                  Aperçu gratuit
                </Badge>
              </div>
            </motion.div>

            {/* Lesson List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-white">
                  Programme du cours
                </h2>
                <span className="text-sm text-muted-foreground">
                  {completedCount}/{lessons.length} terminées
                </span>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className={`glass-card rounded-xl p-4 flex items-center gap-4 group cursor-pointer ${
                      lesson.completed ? "border-emerald-500/20" : ""
                    }`}
                  >
                    {/* Lesson Number */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        lesson.completed
                          ? "bg-emerald-500/15 text-emerald-400"
                          : lesson.isFree
                          ? "bg-purple-500/15 text-purple-400"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                          {lesson.title}
                        </h3>
                        {lesson.isFree && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400">
                            Gratuit
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Resources */}
                    {lesson.resources.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5">
                        {lesson.resources.map((r) => (
                          <div
                            key={r.id}
                            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"
                            title={r.title}
                          >
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      {Math.round(lesson.duration / 60)} min
                    </div>

                    {/* Lock/Play */}
                    <div className="shrink-0">
                      {lesson.isFree || lesson.completed ? (
                        <Play className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Enrollment Card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Inclus dans l&apos;abonnement</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold font-heading text-white">9,90 €</span>
                    <span className="text-muted-foreground">/ mois</span>
                  </div>
                </div>

                <Link href="/sign-up">
                  <Button className="w-full h-12 gradient-bg text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20 text-base font-medium mb-3">
                    S&apos;inscrire au cours
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className="w-full h-10 border-white/10 text-white hover:bg-white/5 text-sm"
                  >
                    Voir les tarifs
                  </Button>
                </Link>

                <Separator className="my-6 bg-white/10" />

                <ul className="space-y-3 text-sm">
                  {[
                    "Accès illimité au cours",
                    `${lessons.length} leçons vidéo HD`,
                    "Partitions & tablatures PDF",
                    "Playbacks d'accompagnement",
                    "Certificat de complétion",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Teacher Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Votre professeur</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                    {course.teacher.firstName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {course.teacher.firstName} {course.teacher.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">Professeur de {course.instrument.name.split(" / ")[0]}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Musicien professionnel avec plus de 15 ans d&apos;expérience.
                  Diplômé du Conservatoire National, passionné par la pédagogie.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
