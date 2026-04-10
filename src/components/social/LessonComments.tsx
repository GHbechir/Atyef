"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MOCK_COMMENTS = [
  {
    id: 1,
    author: "Karim",
    color: "bg-blue-500",
    text: "Super leçon ! J'ai enfin compris comment placer mes doigts sans que ça frise.",
    likes: 12,
    time: "Il y a 2h",
  },
  {
    id: 2,
    author: "Nour",
    color: "bg-purple-500",
    text: "Le tempo à 80 BPM est un peu rapide pour moi. Avez-vous des conseils ?",
    likes: 4,
    time: "Il y a 5h",
  }
];

export function LessonComments() {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: "Moi",
      color: "bg-emerald-500",
      text: newComment,
      likes: 0,
      time: "À l'instant",
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="mt-8 border border-border rounded-xl bg-card overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Questions & Commentaires ({comments.length})</h3>
        </div>
        <span className="text-xs text-muted-foreground">{isOpen ? "Masquer" : "Afficher"}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-5">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-emerald-500 text-white text-xs">M</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Posez une question ou laissez un commentaire..." 
                    className="h-9 bg-background"
                  />
                  <Button type="submit" size="sm" className="h-9 px-3 shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={`${comment.color} text-white text-xs`}>
                        {comment.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-foreground/[0.03] rounded-2xl rounded-tl-none p-3 border border-border/40">
                        <p className="text-xs font-semibold text-foreground mb-1">{comment.author} <span className="text-muted-foreground font-normal ml-2">{comment.time}</span></p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
                      </div>
                      <button className="flex items-center gap-1.5 mt-1.5 ml-2 text-[11px] text-muted-foreground hover:text-accent transition-colors">
                        <ThumbsUp className="w-3 h-3" /> {comment.likes > 0 && comment.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
