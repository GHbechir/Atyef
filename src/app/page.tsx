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
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] animate-liquid-1 liquid-blob-purple mix-blend-screen opacity-60 blur-3xl rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] animate-liquid-2 liquid-blob-emerald mix-blend-screen opacity-40 blur-3xl rounded-full" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] animate-liquid-1 liquid-blob-purple mix-blend-screen opacity-50 blur-3xl rounded-full" style={{ animationDelay: '-10s' }} />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* ====== HEADER / NAVBAR (Apple Pill Style) ====== */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center w-full">
        <header className="glass-pill w-full max-w-5xl h-16 flex items-center justify-between px-2 sm:px-4 transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group px-2">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all">
              <Music2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight text-white hidden sm:block">
              Atyef
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { key: "home", path: "/" },
              { key: "about", path: "/about" },
              { key: "features", path: "/pricing" },
              { key: "courses", path: "/courses" }
            ].map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10"
              >
                {t(item.key as any)}
              </Link>
            ))}
          </nav>

          {/* Accessories & Actions */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center bg-black/50 rounded-full p-1 border border-white/5 mr-2">
              {(["ar", "fr", "en"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                    lang === l
                      ? "bg-white text-black shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="mr-2">
              <ThemeToggle />
            </div>

            <Link href="/sign-in">
              <Button variant="ghost" className="rounded-full font-medium text-white/80 hover:text-white hover:bg-white/10 text-sm h-10 px-5">
                {t("login")}
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 font-medium px-6 shadow-lg h-10 text-sm">
                {t("register")}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/80 hover:text-white bg-white/5 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[72px] left-4 right-4 glass-card p-4 rounded-2xl md:hidden border border-white/10 shadow-xl flex flex-col gap-2">
            {[
              { key: "home", path: "/" },
              { key: "about", path: "/about" },
              { key: "features", path: "/pricing" },
              { key: "courses", path: "/courses" }
            ].map((item) => (
              <Link
                key={item.key}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-colors font-medium text-center"
              >
                {t(item.key as any)}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <div className="flex items-center justify-center py-2">
              <ThemeToggle />
            </div>
            <div className="h-px bg-white/10 my-2" />
            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-white">
                {t("login")}
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-white text-black hover:bg-white/90">
                {t("register")}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* ====== HERO SECTION ====== */}
      <section className="relative flex-1 flex flex-col justify-center min-h-[100vh] pt-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 text-sm font-medium text-white mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>{t("hero_badge")}</span>
            <div className="w-px h-4 bg-white/20 mx-2" />
            <span className="text-white/60">Découvrir</span>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[6rem] font-bold font-heading leading-[1] text-white tracking-tight max-w-5xl"
            style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          >
            {t("hero_title_1")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-white pb-2 inline-block">
              {t("hero_title_highlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-xl md:text-2xl text-white/50 max-w-2xl font-light tracking-wide lg:leading-relaxed"
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
              <Button className="w-full sm:w-auto h-14 px-10 text-base font-semibold bg-white text-black hover:bg-white/90 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                {t("hero_cta")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#preview" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-medium glass-pill border-white/20 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105">
                <Play className="w-4 h-4 mr-2" />
                Voir comment ça marche
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== SHOWCASE SECTION (Shahid/Netflix style Carousel placeholder) ====== */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-end justify-between mb-12">
             <div>
                <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">Masterclasses</h2>
                <p className="text-3xl md:text-4xl font-bold text-white">Apprenez avec les meilleurs.</p>
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
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Piano Fondamentaux", img: "bg-purple-900/40", icon: "🎹" },
                { title: "Guitare Électrique", img: "bg-emerald-900/40", icon: "🎸" },
                { title: "Oud Oriental Mastery", img: "bg-amber-900/40", icon: "🪕" },
              ].map((course, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="group relative h-[400px] rounded-3xl overflow-hidden glass-card cursor-pointer border border-white/5"
                >
                  <div className={`absolute inset-0 ${course.img} transition-transform duration-700 group-hover:scale-110 opacity-50 mix-blend-overlay`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                     <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl">
                        {course.icon}
                     </div>
                     <div>
                        <Badge variant="outline" className="glass-pill border-white/20 text-white mb-4">Nouveau</Badge>
                        <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                        <p className="text-white/60 text-sm line-clamp-2">Plongez dans des leçons immersives avec rendu 4K et partitions synchronisées.</p>
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
