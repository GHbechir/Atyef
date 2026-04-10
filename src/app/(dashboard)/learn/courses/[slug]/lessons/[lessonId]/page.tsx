"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Settings, 
  Menu, 
  CheckCircle2, 
  Disc3,
  Video,
  ListVideo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import confetti from "canvas-confetti";

// Store & Tools
import { useLessonStore } from "@/store/useLessonStore";
import { SheetMusicViewer } from "@/components/tools/SheetMusicViewer";
import { GuitarTabPlayer } from "@/components/tools/GuitarTabPlayer";
import { PerformanceRecorder } from "@/components/tools/PerformanceRecorder";

// Mock Data
import { MOCK_ENROLLED_COURSES } from "@/lib/mock-data";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { setContext, activeTool, setActiveTool } = useLessonStore();
  
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    // In a real app, fetch from DB
    const slug = params.slug as string;
    const lessonId = params.lessonId as string;
    
    // Fallback if MOCK_ENROLLED_COURSES doesn't match
    const foundCourse = MOCK_ENROLLED_COURSES.find(c => c.slug === slug) || MOCK_ENROLLED_COURSES[0];
    setCourse(foundCourse);
    
    // Try to find the exact lesson, fallback to a dummy title if missing
    setLesson({
      id: lessonId,
      title: "La gamme majeure (Pratique)",
      duration: "12:45",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    });

    setContext(foundCourse.id, lessonId);
  }, [params.slug, params.lessonId, setContext]);

  const handleComplete = () => {
    setCompleted(true);
    // Custom music notes confetti using canvas-confetti shapes support
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      // ♩ ♪ ♫ ♬ simple string shapes are usually not supported natively in all canvas-confetti, 
      // but we throw standard colorful shapes with higher density for immersion.
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (!course || !lesson) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 lg:-m-8">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between px-4 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {course.title}
            </span>
            <span className="text-sm font-bold truncate">
              {lesson.title}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowRecorder(!showRecorder)} 
            variant={showRecorder ? "default" : "outline"}
            className="h-8 text-xs gap-1.5 hidden sm:flex"
          >
            <Video className="w-3.5 h-3.5" />
            {showRecorder ? "Fermer l'enregistreur" : "Feedback Premium"}
          </Button>
          <Button 
            onClick={handleComplete} 
            variant={completed ? "secondary" : "default"} 
            className={`h-8 text-xs gap-1.5 transition-all duration-300 ${completed ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "gradient-bg text-white hover:opacity-90 glow-accent shadow-accent/20"}`}
          >
            {completed ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
               <CheckCircle2 className="w-3.5 h-3.5" /> Terminé
              </motion.div>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Marquer comme terminé
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-black/5 dark:bg-black/20">
          
          {/* Video Section (Cinematic Theater Mode) */}
          <div className="w-full bg-black shrink-0 relative group border-b border-border/10">
            <video 
              src={lesson.videoUrl} 
              controls 
              className="w-full h-[60vh] object-cover bg-black"
            />
            {/* Custom Time Badge */}
            <div className="absolute top-4 left-4 bg-background/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-xs font-medium text-white/90">Direct • Reste {lesson.duration}</span>
            </div>
          </div>

          {/* Interactive Tools Section */}
          <div className="flex-1 flex flex-col p-4 lg:p-6 bg-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-primary" />
                Matériel Pratique
              </h2>
              
              <Tabs value={activeTool || "partition"} onValueChange={(v) => setActiveTool(v as any)} className="w-[300px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="partition">Partition</TabsTrigger>
                  <TabsTrigger value="guitar-tab">Tablature</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Primary Tool View */}
              <div className={`transition-all duration-300 ${showRecorder ? "lg:col-span-3" : "lg:col-span-4"}`}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm h-full min-h-[400px]">
                  {activeTool === "partition" && <SheetMusicViewer />}
                  {activeTool === "guitar-tab" && <GuitarTabPlayer />}
                </div>
              </div>

              {/* Recorder Sidebar (Premium Feature) */}
              <AnimatePresence>
                {showRecorder && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: 20, width: 0 }}
                    className="lg:col-span-1"
                  >
                    <PerformanceRecorder />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Playlist / Up Next */}
        <div className="w-80 border-l border-border bg-card flex flex-col hidden xl:flex shrink-0">
           <div className="p-4 border-b border-border flex items-center gap-2 font-semibold">
              <ListVideo className="w-4 h-4 text-primary" />
              Dans ce module
           </div>
           <ScrollArea className="flex-1">
             <div className="p-2 space-y-1">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <button 
                    key={idx}
                    className={`w-full text-left p-3 rounded-lg flex gap-3 items-start transition-colors ${
                      idx === 2 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="mt-0.5">
                      {idx < 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Play className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm">Leçon {idx}: {idx === 2 ? lesson.title : "Introduction et Setup"}</p>
                      <p className="text-xs opacity-70 mt-1">10:00</p>
                    </div>
                  </button>
                ))}
             </div>
           </ScrollArea>
        </div>
      </div>
    </div>
  );
}
