"use client";

import { motion } from "framer-motion";
import { Music, Heart, Target, Sparkles, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/6 rounded-full blur-[140px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-sm text-accent mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-breathe" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Notre histoire</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-heading mb-6 tracking-tight">
            La musique, notre <span className="gradient-text-purple">passion commune</span>
          </h1>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Chez Atyef, nous croyons que la musique n’est pas qu’une simple discipline, c’est un langage universel qui rassemble et élève. Notre mission est de rendre l’apprentissage musical accessible, engageant et profondément humain.
          </p>

          {/* Micro-stats */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-border/40">
            {[
              { value: "10 000+", label: "Apprenants" },
              { value: "200+", label: "Professeurs" },
              { value: "1 400+", label: "Leçons" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold font-heading gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: <Heart className="w-7 h-7 text-rose-400" />,
              title: "Passion",
              description: "Transmettre notre amour de la musique au travers de chaque leçon.",
              accent: "rose",
            },
            {
              icon: <Target className="w-7 h-7 text-blue-400" />,
              title: "Excellence",
              description: "Des professeurs triés sur le volet et une pédagogie éprouvée.",
              accent: "blue",
            },
            {
              icon: <Users className="w-7 h-7 text-emerald-400" />,
              title: "Communauté",
              description: "Apprenez, échangez et grandissez avec des musiciens du monde entier.",
              accent: "emerald",
            }
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center group hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 w-14 h-14 rounded-2xl gradient-bg blur-xl opacity-40" />
              </div>
              <h2 className="text-3xl font-bold font-heading">La vision Atyef</h2>
            </div>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Atyef est née d’un constat simple : l’apprentissage traditionnel de la musique peut souvent sembler rigide et inaccessible. Nous avons voulu créer un espace où la rigueur académique rencontre la flexibilité du numérique.
              </p>
              <p>
                Que vous souhaitiez gratouiller quelques accords au coin du feu ou maîtriser des sonates complexes, notre plateforme a été pensée pour s’adapter à <strong className="text-foreground font-medium">votre rythme</strong> et à <strong className="text-foreground font-medium">vos objectifs</strong>.
              </p>
              <p>
                Aujourd’hui, Atyef met en relation des professeurs passionnés avec des milliers d’élèves, brisant les frontières pour créer la plus belle des symphonies : celle du partage.
              </p>
            </div>
            
            <div className="mt-10 flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Engagés pour une éducation musicale de la plus haute qualité.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
