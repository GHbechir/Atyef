"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Play, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSTRUMENTS, FEATURED_COURSES } from "@/lib/mock-data";

const levels = [
  { value: "all", label: "Tous les niveaux" },
  { value: "BEGINNER", label: "Débutant" },
  { value: "INTERMEDIATE", label: "Intermédiaire" },
  { value: "ADVANCED", label: "Avancé" },
];

const styles = [
  { value: "all", label: "Tous les styles" },
  { value: "CLASSICAL", label: "Classique" },
  { value: "JAZZ", label: "Jazz" },
  { value: "ROCK", label: "Rock" },
  { value: "POP", label: "Pop" },
  { value: "BLUES", label: "Blues" },
];

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
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [instrument, setInstrument] = useState("all");
  const [level, setLevel] = useState("all");
  const [style, setStyle] = useState("all");

  // In a real app, this would filter from the API
  const filteredCourses = FEATURED_COURSES.filter((course) => {
    if (search && !course.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (instrument !== "all" && course.instrument.slug !== instrument) return false;
    if (level !== "all" && course.level !== level) return false;
    if (style !== "all" && course.style !== style) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">
            Catalogue des <span className="gradient-text">cours</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explorez plus de 150 cours pour tous les niveaux et tous les instruments.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground h-11"
            />
          </div>
          <Select value={instrument} onValueChange={(val) => setInstrument(val || "all")}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white h-11">
              <SelectValue placeholder="Instrument" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les instruments</SelectItem>
              {INSTRUMENTS.map((inst) => (
                <SelectItem key={inst.slug} value={inst.slug}>
                  {inst.icon} {inst.name.split(" / ")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(val) => setLevel(val || "all")}>
            <SelectTrigger className="w-full sm:w-44 bg-white/5 border-white/10 text-white h-11">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={style} onValueChange={(val) => setStyle(val || "all")}>
            <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white h-11">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((s) => (
                 <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredCourses.length} cours trouvés
        </div>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Aucun cours trouvé</h3>
            <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres</p>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => { setSearch(""); setInstrument("all"); setLevel("all"); setStyle("all"); }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-80"
                        style={{
                          background: `linear-gradient(135deg, ${course.instrument.color || "#6C3CE1"}40, ${course.instrument.color || "#6C3CE1"}15)`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <LevelBadge level={course.level} />
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-sm text-white border border-white/10">
                          {course.lessonCount} leçons
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: course.instrument.color || "#6C3CE1" }}
                        />
                        <span className="text-xs text-muted-foreground font-medium">
                          {course.instrument.name.split(" / ")[0]}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                            {course.teacher.firstName?.[0]}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {course.teacher.firstName} {course.teacher.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {Math.round(course.duration / 60)}h
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
