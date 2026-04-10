import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Users, PlayCircle, Percent } from "lucide-react";

// Rate: 5€ per hour of watch time
const HOURLY_RATE = 5.0;

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default async function AdminFinancesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user is admin
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all teachers with their courses, lessons, and progress data
  const teachers = await db.user.findMany({
    where: { role: "TEACHER" },
    include: {
      courses: {
        include: {
          lessons: {
            include: {
              progress: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let globalWatchedSeconds = 0;

  // Transform data to get aggregated stats per teacher
  const teacherStats = teachers.map((teacher) => {
    let teacherWatchedSeconds = 0;
    
    // We group stats per course to display in the accordion
    const coursesStats = teacher.courses.map((course) => {
      let courseWatchedSeconds = 0;
      
      const lessonsStats = course.lessons.map((lesson) => {
        // Sum watchedSeconds for this lesson
        const lessonWatchedSeconds = lesson.progress.reduce((acc, p) => acc + p.watchedSeconds, 0);
        const activeLearners = lesson.progress.length;
        
        // Max possible watch time = active learners * duration
        const maxPossibleWatchTime = activeLearners * lesson.duration;
        
        // Viewing percentage
        const viewingPercentage = maxPossibleWatchTime > 0 
          ? (lessonWatchedSeconds / maxPossibleWatchTime) * 100 
          : 0;
          
        courseWatchedSeconds += lessonWatchedSeconds;
        
        return {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          activeLearners,
          watchedSeconds: lessonWatchedSeconds,
          viewingPercentage,
        };
      });
      
      teacherWatchedSeconds += courseWatchedSeconds;
      
      return {
        id: course.id,
        title: course.title,
        lessonsStats,
        watchedSeconds: courseWatchedSeconds,
      };
    });
    
    globalWatchedSeconds += teacherWatchedSeconds;
    
    const revenue = (teacherWatchedSeconds / 3600) * HOURLY_RATE;

    const teacherName = teacher.lastName && teacher.firstName 
      ? `${teacher.firstName} ${teacher.lastName}`
      : teacher.firstName || "Professeur Anonyme";

    return {
      id: teacher.id,
      name: teacherName,
      email: teacher.email,
      avatarUrl: teacher.avatarUrl,
      coursesStats,
      totalWatchedSeconds: teacherWatchedSeconds,
      estimatedRevenue: revenue,
    };
  }).sort((a, b) => b.totalWatchedSeconds - a.totalWatchedSeconds);

  const globalRevenue = (globalWatchedSeconds / 3600) * HOURLY_RATE;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Rémunération des Enseignants</h1>
        <p className="text-muted-foreground">Suivez le temps de visionnage global et les montants dus (Taux : {formatCurrency(HOURLY_RATE)}/heure).</p>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/5 border-white/10 glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Temps Total Visionné</CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatDuration(globalWatchedSeconds)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cumul de tous les professeurs
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Rémunération Globale Estimée</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(globalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              À redistribuer ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Enseignants Actifs</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{teacherStats.filter(t => t.totalWatchedSeconds > 0).length} / {teachers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Professeurs générant des vues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher List */}
      <Card className="bg-[#0a0a12] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Détails par Professeur</CardTitle>
          <CardDescription>
            Cliquez sur un professeur pour voir ses taux de visionnage par vidéo (quotas).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion className="w-full space-y-4">
            {teacherStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Aucun professeur trouvé.</div>
            ) : (
              teacherStats.map((teacher) => (
                <AccordionItem 
                  key={teacher.id} 
                  value={teacher.id} 
                  className="border border-white/10 rounded-xl overflow-hidden bg-white/5 data-[state=open]:bg-white/[0.07] transition-all px-1"
                >
                  <AccordionTrigger className="hover:no-underline px-4 py-3">
                    <div className="flex items-center justify-between w-full pr-4 text-left">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src={teacher.avatarUrl || undefined} />
                          <AvatarFallback className="bg-purple-500/20 text-purple-400">
                            {teacher.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 text-right hidden sm:flex">
                        <div>
                          <p className="text-xs text-muted-foreground">Temps visionné</p>
                          <p className="font-medium text-white">{formatDuration(teacher.totalWatchedSeconds)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rémunération</p>
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold mt-1">
                            {formatCurrency(teacher.estimatedRevenue)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-4 pb-4">
                    <div className="pt-4 border-t border-white/10 space-y-6">
                      {/* Mobile view for stats */}
                      <div className="flex items-center justify-between sm:hidden mb-4 p-3 rounded-lg bg-black/20">
                        <div>
                          <p className="text-xs text-muted-foreground">Temps visionné</p>
                          <p className="font-medium text-white">{formatDuration(teacher.totalWatchedSeconds)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Rémunération</p>
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold">
                            {formatCurrency(teacher.estimatedRevenue)}
                          </Badge>
                        </div>
                      </div>

                      {teacher.coursesStats.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Ce professeur n'a pas encore de cours.</p>
                      ) : (
                        teacher.coursesStats.map((course) => (
                          <div key={course.id} className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-300">
                              <PlayCircle className="w-4 h-4" />
                              {course.title}
                            </h4>
                            
                            <div className="rounded-md border border-white/10 overflow-hidden">
                              <Table>
                                <TableHeader className="bg-black/40">
                                  <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-white/60">Leçon</TableHead>
                                    <TableHead className="text-white/60">Élèves Actifs</TableHead>
                                    <TableHead className="text-white/60">Temps Visionné</TableHead>
                                    <TableHead className="text-right text-white/60 w-[150px]">Taux de Visionnage</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {course.lessonsStats.length === 0 ? (
                                    <TableRow className="border-white/10">
                                      <TableCell colSpan={4} className="text-center text-muted-foreground h-12">Aucune leçon dans ce cours</TableCell>
                                    </TableRow>
                                  ) : (
                                    course.lessonsStats.map((lesson) => (
                                      <TableRow key={lesson.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-medium text-white/90">
                                          {lesson.title}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                          {lesson.activeLearners} élève(s)
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono">
                                          {formatDuration(lesson.watchedSeconds)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex items-center justify-end gap-2">
                                            <span className="font-mono text-white">{lesson.viewingPercentage.toFixed(1)}%</span>
                                            <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                              <div 
                                                className={`h-full ${lesson.viewingPercentage > 75 ? 'bg-emerald-400' : lesson.viewingPercentage > 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                                                style={{ width: `${Math.min(100, Math.max(0, lesson.viewingPercentage))}%` }}
                                              />
                                            </div>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
