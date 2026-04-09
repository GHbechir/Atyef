"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOCK_ENROLLED_COURSES, FEATURED_COURSES } from "@/lib/mock-data";

export default function LearnerCoursesPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Mes cours</h1>
        <p className="text-muted-foreground text-sm">Retrouvez tous vos cours en un seul endroit.</p>
      </motion.div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          En cours ({MOCK_ENROLLED_COURSES.length})
        </h2>
        <div className="space-y-4">
          {MOCK_ENROLLED_COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/learn/courses/${course.id}`}>
                <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 group cursor-pointer">
                  <div
                    className="w-full sm:w-40 h-28 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${course.instrument.color}30, ${course.instrument.color}10)` }}
                  >
                    <Play className="w-8 h-8 text-white/70 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: course.instrument.color || "#6C3CE1" }} />
                      <span className="text-xs text-muted-foreground">{course.instrument.name.split(" / ")[0]}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-500/30 text-purple-400">
                        {course.level === "BEGINNER" ? "Débutant" : course.level === "INTERMEDIATE" ? "Intermédiaire" : "Avancé"}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{course.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{course.progress}% complété</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round(course.duration / 60)}h
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                      <Button size="sm" className="gradient-bg text-white hover:opacity-90 border-0 shrink-0 hidden sm:flex">
                        Continuer
                        <Play className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Cours recommandés
          </h2>
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white">
              Explorer le catalogue
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_COURSES.slice(3, 6).map((course, i) => (
            <motion.div
              key={course.id}
              className="glass-card rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <div
                className="h-32 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${course.instrument.color}25, ${course.instrument.color}08)` }}
              >
                <Play className="w-8 h-8 text-white/50 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: course.instrument.color || "#6C3CE1" }} />
                  <span className="text-[11px] text-muted-foreground">{course.instrument.name.split(" / ")[0]}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.lessonCount} leçons</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.round(course.duration / 60)}h</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
