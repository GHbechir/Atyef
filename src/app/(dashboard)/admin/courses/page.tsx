"use client";

import { motion } from "framer-motion";
import { Search, MoreVertical, Eye, Play, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FEATURED_COURSES } from "@/lib/mock-data";

const adminCourses = FEATURED_COURSES.map((c, i) => ({
  ...c,
  status: i === 5 ? "PENDING" : i === 4 ? "REJECTED" : "PUBLISHED",
  author: `${c.teacher.firstName} ${c.teacher.lastName}`,
  createdAt: new Date(2025, 10 - i, 15).toLocaleDateString("fr-FR"),
}));

function CourseStatusBadge({ status }: { status: string }) {
  if (status === "PUBLISHED") return <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Publié</Badge>;
  if (status === "PENDING") return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">En attente</Badge>;
  return <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">Rejeté</Badge>;
}

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Modération des Cours</h1>
        <p className="text-muted-foreground text-sm">Gérez et modérez tous les cours de la plateforme.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un cours ou un professeur..." className="pl-9 bg-white/5 border-white/10 text-white h-10" />
        </div>
      </div>

      <motion.div
        className="glass-card rounded-xl overflow-hidden border border-white/5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="text-muted-foreground">Cours</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Professeur</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Créé le</TableHead>
                <TableHead className="text-muted-foreground text-right sm:text-left">Statut</TableHead>
                <TableHead className="text-right text-muted-foreground border-0">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminCourses.map((course) => (
                <TableRow key={course.id} className="border-white/5 hover:bg-white/3">
                  <TableCell>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${course.instrument.color}30, ${course.instrument.color}10)` }}>
                          <Play className="w-4 h-4 text-white/50" />
                       </div>
                       <div className="min-w-0">
                         <div className="font-medium text-white text-sm truncate">{course.title}</div>
                         <div className="text-xs text-muted-foreground truncate">{course.instrument.name}</div>
                       </div>
                     </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{course.author}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{course.createdAt}</span>
                  </TableCell>
                  <TableCell className="text-right sm:text-left">
                    <CourseStatusBadge status={course.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> Prévisualiser</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {course.status !== "PUBLISHED" && (
                           <DropdownMenuItem className="text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Approuver et Publier</DropdownMenuItem>
                        )}
                        {course.status !== "REJECTED" && (
                           <DropdownMenuItem className="text-destructive"><XCircle className="w-3.5 h-3.5 mr-2" /> Rejeter / Dépublier</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
