"use client";

import { motion } from "framer-motion";
import { Search, Mail, BookOpen, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const students = [
  { id: 1, name: "Lucas Martin", email: "lucas.m@email.com", course: "Piano : Les Fondamentaux", progress: 85, lastActive: "Aujourd'hui", timeSpent: "12h 30m" },
  { id: 2, name: "Emma Petit", email: "emma.p@email.com", course: "Piano : Les Fondamentaux", progress: 42, lastActive: "Hier", timeSpent: "6h 15m" },
  { id: 3, name: "Hugo Dubois", email: "hugo.d@email.com", course: "Blues Guitar Masterclass", progress: 65, lastActive: "Il y a 2 jours", timeSpent: "8h 45m" },
  { id: 4, name: "Léa Moreau", email: "lea.m@email.com", course: "Jazz Piano Avancé", progress: 23, lastActive: "La semaine dernière", timeSpent: "3h 20m" },
  { id: 5, name: "Thomas Leroy", email: "thomas.l@email.com", course: "Piano : Les Fondamentaux", progress: 100, lastActive: "Aujourd'hui", timeSpent: "14h 00m" },
  { id: 6, name: "Chloé Roux", email: "chloe.r@email.com", course: "Blues Guitar Masterclass", progress: 5, lastActive: "Hier", timeSpent: "0h 45m" },
];

export default function TeacherStudentsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Mes élèves</h1>
        <p className="text-muted-foreground text-sm">Suivez la progression de vos {students.length} élèves inscrits.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un élève par nom, email..." className="pl-9 bg-white/5 border-white/10 text-white" />
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
          Exporter (CSV)
        </Button>
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
                <TableHead className="text-muted-foreground">Élève</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Cours suivi</TableHead>
                <TableHead className="text-muted-foreground">Progression</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Temps passé</TableHead>
                <TableHead className="text-muted-foreground text-right border-0">Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="border-white/5 hover:bg-white/3">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] text-white">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{student.name}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground line-clamp-1">{student.course}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px]">
                        <Progress value={student.progress} className="h-1.5" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-8">
                        {student.progress}%
                      </span>
                      {student.progress === 100 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 ml-2">
                          Terminé
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{student.timeSpent}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">{student.lastActive}</span>
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
