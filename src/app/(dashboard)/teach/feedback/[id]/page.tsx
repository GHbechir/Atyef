"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Video,
  Mic,
  Star,
  Send,
  MessageSquare,
  Play,
  CheckCircle2,
  AlertCircle,
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

// Simili-données car l'API n'est pas encore branchée
const mockData = {
  id: "f1",
  student: "Karim B.",
  course: "Jazz Guitare Masterclass",
  lesson: "Improvisation II-V-I",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  date: "Il y a 1 heure"
};

export default function TeacherFeedbackReviewPage() {
  const router = useRouter();
  const params = useParams();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // Notes
  const [rhythmScore, setRhythmScore] = useState(0);
  const [postureScore, setPostureScore] = useState(0);
  const [musicalityScore, setMusicalityScore] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer pour la caméra
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordTime(prev => prev + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    // Dans une vraie implémentation, MediaRecorder start ici
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
  };

  const handleSendFeedback = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        router.push("/teach");
      }, 2000);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderStars = (score: number, setScore: (s: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            onClick={() => setScore(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star className={`w-5 h-5 ${star <= score ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
          </button>
        ))}
      </div>
    );
  };

  if (isSent) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold font-heading mb-2">Feedback Envoyé !</h1>
          <p className="text-muted-foreground">L'élève recevra une notification pour visionner vos corrections.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold font-heading">Évaluation : {mockData.student}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                Urgent
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{mockData.course} • {mockData.lesson}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Col - Player */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl relative border-border/10 bg-black/40">
            {/* Student Video */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video 
                src={mockData.videoUrl} 
                className="w-full h-full object-contain"
                controls
              />
              {/* Overlay indicateur lors de la lecture */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold text-white/90">
                <Video className="w-3.5 h-3.5 text-blue-400" /> Vidéo de l'élève
              </div>
            </div>
          </div>

          {/* Feedback Formulaire & Grille */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" /> Grille d'évaluation
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Rythme & Tempo</p>
                {renderStars(rhythmScore, setRhythmScore)}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Posture & Technique</p>
                {renderStars(postureScore, setPostureScore)}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Musicalité / Expressivité</p>
                {renderStars(musicalityScore, setMusicalityScore)}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Notes écrites additionnelles
              </label>
              <Textarea 
                placeholder="Ajoutez des détails sur la posture, des conseils d'exercices..." 
                className="min-h-[120px] bg-background border-border/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Col - Recorder */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col h-[400px]">
             <h3 className="text-base font-bold font-heading mb-4 flex items-center justify-between">
                <span>Ma Réponse Vidéo</span>
                {isRecording && <span className="text-xs text-red-500 font-bold animate-pulse">ENREGISTREMENT...</span>}
             </h3>

             {/* Fake Camera Preview */}
             <div className="flex-1 bg-black/50 rounded-xl relative overflow-hidden mb-4 border border-border/30 flex items-center justify-center">
                {!hasRecorded && !isRecording ? (
                  <div className="text-center">
                    <Video className="w-10 h-10 text-white/20 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">La webcam s'activera ici</p>
                  </div>
                ) : isRecording ? (
                  <>
                    <div className="absolute inset-0 bg-blue-900/20" />
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-md">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-mono text-white">{formatTime(recordTime)}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-emerald-900/20 flex flex-col items-center justify-center">
                    <Play className="w-12 h-12 text-white/60 mb-2 cursor-pointer hover:text-white transition-colors" />
                    <p className="text-xs text-emerald-400 font-semibold">Prise terminée ({formatTime(recordTime)})</p>
                  </div>
                )}
             </div>

             {/* Controls */}
             <div className="flex flex-col gap-3">
                {!isRecording && !hasRecorded && (
                  <Button onClick={handleStartRecording} className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold gap-2">
                    <Video className="w-4 h-4" /> Démarrer l'enregistrement
                  </Button>
                )}
                {isRecording && (
                  <Button onClick={handleStopRecording} className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-bold gap-2">
                    <Square className="w-4 h-4 text-red-500 fill-red-500" /> Arrêter
                  </Button>
                )}
                {hasRecorded && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setHasRecorded(false)} className="flex-1 h-11 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                      Recommencer
                    </Button>
                    <Button variant="secondary" className="flex-1 h-11">
                      Aperçu
                    </Button>
                  </div>
                )}
             </div>
          </div>

          <div className="glass-card rounded-xl p-5 border-emerald-500/20 bg-emerald-500/5">
             <div className="flex items-start gap-3 mb-4">
               <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Le feedback asynchrone est le service premium de votre plateforme. Assurez-vous d'être bien éclairé et d'utiliser une guitare accordée pour vos démonstrations.
               </p>
             </div>
             
             <Button 
               disabled={!hasRecorded || rhythmScore === 0 || isSending}
               onClick={handleSendFeedback}
               className={`w-full h-12 font-bold text-white gap-2 transition-all ${
                 (!hasRecorded || rhythmScore === 0) ? "bg-white/5 opacity-50" : "gradient-bg shadow-lg shadow-accent/20 glow-accent"
               }`}
             >
               {isSending ? (
                 <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Envoi en cours...</span>
               ) : (
                 <><Send className="w-4 h-4" /> Envoyer le Feedback</>
               )}
             </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
