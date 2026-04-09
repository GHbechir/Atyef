"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, BookOpen, Users, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            La nouvelle référence de l'apprentissage musical
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-6"
          >
            Maîtrisez la musique avec <span className="gradient-text-purple">Atyef</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Découvrez une plateforme de cours de musique premium. Des professeurs certifiés, une méthode innovante et une communauté passionnée pour vous accompagner à chaque note.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/courses">
              <Button className="h-14 px-8 text-lg gradient-bg hover:opacity-90 border-0 shadow-lg shadow-purple-500/25 transition-all hover:scale-105">
                Explorer le catalogue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-14 px-8 text-lg bg-white/5 hover:bg-white/10 border-white/10 transition-all hover:scale-105 backdrop-blur-sm group">
                <Play className="mr-2 w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                Voir les abonnements
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Pourquoi choisir Atyef ?</h2>
            <p className="text-muted-foreground text-lg">L'excellence musicale à portée de clic.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8 text-blue-400" />,
                title: "Catalogue Exhaustif",
                description: "Piano, guitare, chant et plus. Des centaines de cours pour tous les niveaux, du débutant absolu à l'expert."
              },
              {
                icon: <Users className="w-8 h-8 text-emerald-400" />,
                title: "Professeurs Renommés",
                description: "Apprenez avec des musiciens professionnels et des pédagogues passionnés qui vous guident pas à pas."
              },
              {
                icon: <Trophy className="w-8 h-8 text-amber-400" />,
                title: "Progression Rapide",
                description: "Une méthode structurée, des exercices interactifs et un suivi de votre évolution pour garantir vos progrès."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 glass-card p-12 rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/10">
          <Star className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold font-heading mb-6">Prêt à révéler votre talent ?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Rejoignez des milliers de musiciens qui ont déjà transformé leur façon d'apprendre avec Atyef.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-up">
              <Button className="h-12 px-8 text-base gradient-bg hover:opacity-90 border-0 shadow-lg transition-transform hover:scale-105">
                Commencer l'essai gratuit
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/10 transition-transform hover:scale-105 text-white">
                Découvrir notre histoire
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
