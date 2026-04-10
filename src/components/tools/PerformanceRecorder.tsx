"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Mic, Square, Play, Trash2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function PerformanceRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Impossible d'accéder à la caméra ou au microphone.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    setRecording(true);
    setVideoUrl(null);
    chunksRef.current = [];
    setTime(0);

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();

    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    stopCamera();
  };

  const deleteRecording = () => {
    setVideoUrl(null);
    setTime(0);
  };

  const submitPerformance = async () => {
    setIsSubmitting(true);
    // Simulation of an upload to S3/Db
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Performance envoyée ! Le professeur a été notifié.");
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Feedback Premium</h3>
          <p className="text-sm text-muted-foreground">
            Enregistrez-vous et recevez l'avis d'un professeur.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!stream && !videoUrl && !submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-48 rounded-xl bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4"
          >
            <Button onClick={startCamera} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Video className="w-4 h-4 mr-2" />
              Allumer la caméra
            </Button>
            <p className="text-xs text-muted-foreground text-center px-4">
              Réservé aux membres Premium. Votre vidéo sera envoyée de manière sécurisée.
            </p>
          </motion.div>
        )}

        {stream && !videoUrl && !submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-64 bg-black rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center justify-end"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-mono font-medium flex items-center gap-2">
                {recording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                {formatTime(time)}
              </div>
            </div>

            <div className="relative z-10 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4 mt-auto">
              {!recording ? (
                <Button onClick={startRecording} variant="destructive" className="rounded-full shadow-lg h-12 px-6">
                  <Mic className="w-4 h-4 mr-2" />
                  Commencer l'enregistrement
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="secondary" className="rounded-full shadow-lg h-12 px-6">
                  <Square className="w-4 h-4 mr-2 text-red-500" />
                  Arrêter
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {videoUrl && !submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="relative h-64 bg-black rounded-xl overflow-hidden shadow-inner">
              <video
                src={videoUrl}
                controls
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button onClick={deleteRecording} variant="outline" className="flex-1 border-destructive/20 hover:bg-destructive/10 text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Recommencer
              </Button>
              <Button onClick={submitPerformance} disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Envoi..." : "Envoyer pour Feedback"}
              </Button>
            </div>
          </motion.div>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-48 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center gap-3 text-center p-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
            <h4 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">Excellent travail !</h4>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80">
              Votre performance a été envoyée. Vous recevrez un feedback de votre professeur très prochainement.
            </p>
            <Button variant="outline" size="sm" onClick={() => {setSubmitted(false); setVideoUrl(null); setTime(0)}} className="mt-2 text-emerald-600 border-emerald-200">
              Faire une autre prise
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
