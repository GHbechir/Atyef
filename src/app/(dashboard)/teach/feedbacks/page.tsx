"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Star, Send, Clock, CheckCircle2, MessageSquare, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MOCK_SUBMISSIONS = [
  {
    id: "sub_1",
    studentName: "Amine",
    courseTitle: "Oud : Initiation au Roi des Instruments",
    lessonTitle: "Leçon 2: Technique de la main droite",
    submittedAt: "Il y a 2 heures",
    status: "PENDING",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "sub_2",
    studentName: "Sarah",
    courseTitle: "Piano Débutant",
    lessonTitle: "Leçon 4: Akkords de base",
    submittedAt: "Il y a 1 jour",
    status: "REVIEWED",
    rating: 4,
    feedback: "Très bien Sarah ! Attention au rythme sur la deuxième mesure, essaie d'utiliser davantage ton métronome.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  }
];

export default function FeedbacksPage() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [activeSubmission, setActiveSubmission] = useState(submissions[0]);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  const pendingCount = submissions.filter(s => s.status === "PENDING").length;

  const handleSubmitFeedback = () => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === activeSubmission.id 
          ? { ...sub, status: "REVIEWED", rating, feedback: feedbackText } 
          : sub
      )
    );
    setActiveSubmission({ ...activeSubmission, status: "REVIEWED", rating, feedback: feedbackText } as any);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold font-heading text-foreground">Évaluations & Feedback</h1>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
              {pendingCount} en attente
            </Badge>
          </div>
          <p className="text-muted-foreground">Visionnez les performances de vos élèves Premium et guidez-les.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: List of submissions */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold px-1">Soumissions récentes</h3>
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setActiveSubmission(sub)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeSubmission.id === sub.id
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">{sub.studentName}</span>
                  {sub.status === "PENDING" ? (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px]">En attente</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px]">Corrigé</Badge>
                  )}
                </div>
                <p className="text-xs font-medium text-foreground truncate">{sub.courseTitle}</p>
                <p className="text-xs text-muted-foreground truncate">{sub.lessonTitle}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {sub.submittedAt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Review Panel */}
        <div className="lg:col-span-2">
          {activeSubmission ? (
            <motion.div
              key={activeSubmission.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Video Player */}
              <div className="aspect-video bg-black relative">
                <video src={activeSubmission.videoUrl} controls className="w-full h-full object-contain" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Performance de {activeSubmission.studentName}
                </div>
              </div>

              {/* Action Panel */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">{activeSubmission.lessonTitle}</h2>
                  <p className="text-muted-foreground">{activeSubmission.courseTitle}</p>
                </div>

                {activeSubmission.status === "PENDING" ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Note (Optionnel)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-2 rounded-full transition-colors ${
                              rating >= star ? "text-amber-400" : "text-muted-foreground hover:text-amber-400/50"
                            }`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Votre retour pédagogique</label>
                      <Textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Qu'avez-vous pensé de cette performance ? Ex: Attention au tempo sur la mesure 4..."
                        className="min-h-[120px] resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Video className="w-4 h-4" />
                        Répondre en Vidéo
                      </Button>
                      <Button onClick={handleSubmitFeedback} className="gap-2 flex-1">
                        <Send className="w-4 h-4" />
                        Envoyer le Feedback
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">Feedback envoyé !</h3>
                    </div>
                    
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-5 h-5 ${activeSubmission.rating! >= star ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>

                    <div className="bg-background rounded-lg p-4 text-sm border border-border">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-foreground">{activeSubmission.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/30">
              Sélectionnez une soumission pour commencer la revue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
