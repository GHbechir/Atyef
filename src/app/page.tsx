"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  BookOpen,
  Users,
  Trophy,
  Star,
  Music2,
  Globe,
  Sparkles,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useState, useEffect } from "react";
import { Language } from "@/locales/types";

export default function Home() {
  const { t, lang, setLang, dir } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRtl = dir === "rtl";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden font-sans relative selection:bg-accent/30">
      
      {/* ====== LIQUID GLASS BACKGROUND ====== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-background">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] animate-liquid-1 liquid-blob-purple blur-3xl rounded-full" 
          style={{ mixBlendMode: 'var(--blob-blend)' as any, opacity: 'var(--blob-opacity)' as any }}
        />
        <div 
          className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] animate-liquid-2 liquid-blob-emerald blur-3xl rounded-full" 
          style={{ mixBlendMode: 'var(--blob-blend)' as any, opacity: 'var(--blob-opacity)' as any }}
        />
        <div 
          className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] animate-liquid-1 liquid-blob-purple blur-3xl rounded-full" 
          style={{ animationDelay: '-10s', mixBlendMode: 'var(--blob-blend)' as any, opacity: 'var(--blob-opacity)' as any }}
        />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* ====== HERO SECTION ====== */}
      <section className="relative flex-1 flex flex-col justify-center min-h-[90vh] pt-20 sm:pt-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full glass border border-white/10 text-[13px] sm:text-sm font-medium text-foreground mb-6 sm:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse shrink-0" />
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{t("hero_badge")}</span>
            <div className="w-px h-4 bg-foreground/20 mx-1" />
            <span className="text-foreground/50">Découvrir</span>
            <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold font-heading leading-tight sm:leading-[1] text-foreground tracking-tight max-w-5xl"
          >
            {t("hero_title_1")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-white pb-2 inline-block animate-gradient">
              {t("hero_title_highlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-foreground/50 max-w-2xl font-light tracking-wide lg:leading-relaxed"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mt-12"
          >
            <Link href="/courses" className="w-full sm:w-auto group">
              <Button className="w-full sm:w-auto h-14 px-10 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 rounded-full shadow-xl shadow-primary/30 transition-all duration-300 group-hover:scale-105 glow-accent">
                {t("hero_cta")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#preview" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-medium glass border-border/60 hover:bg-foreground/5 text-foreground rounded-full transition-all duration-300 hover:scale-105">
                <Play className="w-4 h-4 mr-2" />
                Voir comment ça marche
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== SHOWCASE SECTION ====== */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-border/30 bg-foreground/[0.02] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-end justify-between mb-12">
             <div>
                <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">Masterclasses</h2>
                <p className="text-3xl md:text-4xl font-bold text-foreground">Apprenez avec les meilleurs.</p>
             </div>
             <div className="hidden md:flex gap-2">
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
             </div>
           </div>

           {/* Cinematic Cards */}
           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { title: "Piano Fondamentaux", img: "bg-purple-900/40", icon: "🎹", level: "Débutant" },
                { title: "Guitare Électrique", img: "bg-emerald-900/40", icon: "🎸", level: "Intermédiaire" },
                { title: "Oud Oriental Mastery", img: "bg-amber-900/40", icon: "🪕", level: "Avancé" },
              ].map((course, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/5 hover:border-accent/20"
                >
                  <div className={`absolute inset-0 ${course.img} transition-transform duration-700 group-hover:scale-110 opacity-40 mix-blend-overlay`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                       <div className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-2xl shadow-lg">
                          {course.icon}
                       </div>
                       <div className="glass-pill px-3 py-1 text-[10px] font-semibold text-foreground/70 uppercase tracking-wider">
                         {course.level}
                       </div>
                     </div>
                     <div>
                        <Badge variant="outline" className="glass border-accent/20 text-accent mb-3 text-[10px]">Nouveau</Badge>
                        <h3 className="text-xl font-bold text-foreground mb-1.5 group-hover:text-accent transition-colors duration-300">{course.title}</h3>
                        <p className="text-foreground/50 text-xs leading-relaxed">Leçons immersives · Partitions · Feedback IA</p>
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

    </div>
  );
}
