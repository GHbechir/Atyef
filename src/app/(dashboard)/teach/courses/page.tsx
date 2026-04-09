"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Play, Users, Eye, BookOpen, MoreVertical, Search, Edit2, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { FEATURED_COURSES } from "@/lib/mock-data";

const courses = FEATURED_COURSES.map((c, i) => ({
  ...c,
  students: [342, 156, 89, 45, 210, 67][i] || 0,
  views: [12450, 5620, 3200, 890, 7800, 2100][i] || 0,
  published: i < 4,
  revenue: [2150, 980, 650, 0, 1200, 0][i] || 0,
  createdAt: new Date(2025, 10 - i, 15).toLocaleDateString("fr-FR"),
}));

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white mb-1">Mes cours</h1>
          <p className="text-muted-foreground text-sm">{courses.length} cours créés</p>
        </div>
        <Link href="/teach/courses/new">
          <Button className="gradient-bg text-white hover:opacity-90 border-0">
            <PlusCircle className="w-4 h-4 mr-2" /> Nouveau cours
          </Button>
        </Link>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher un cours..." className="pl-9 bg-white/5 border-white/10 text-white h-10" />
      </div>

      <div className="space-y-3">
        {courses.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${course.instrument.color}30, ${course.instrument.color}10)` }}
              >
                <Play className="w-6 h-6 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${course.published ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"}`}>
                    {course.published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students} élèves</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{course.views.toLocaleString("fr-FR")} vues</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessonCount} leçons</span>
                  <span>Créé le {course.createdAt}</span>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-semibold text-white">{course.revenue} €</p>
                <p className="text-[10px] text-muted-foreground">revenus totaux</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 shrink-0 text-muted-foreground hover:text-white rounded-md hover:bg-white/5 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit2 className="w-3.5 h-3.5 mr-2" /> Modifier</DropdownMenuItem>
                  <DropdownMenuItem><BarChart3 className="w-3.5 h-3.5 mr-2" /> Analytics</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
