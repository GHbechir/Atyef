"use client";

import { motion } from "framer-motion";
import { Music, Heart, Target, Sparkles, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border text-sm text-accent mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>Notre histoire</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-heading mb-6 tracking-tight">
            La musique, notre <span className="gradient-text-purple">passion commune</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chez Atyef, nous croyons que la musique n'est pas qu'une simple discipline, c'est un langage universel qui rassemble et élève. Notre mission est de rendre l'apprentissage musical accessible, engageant et profondément humain.
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Heart className="w-8 h-8 text-rose-400" />,
              title: "Passion",
              description: "Transmettre notre amour de la musique au travers de chaque leçon."
            },
            {
              icon: <Target className="w-8 h-8 text-blue-400" />,
              title: "Excellence",
              description: "Des professeurs triés sur le volet et une pédagogie éprouvée."
            },
            {
              icon: <Users className="w-8 h-8 text-emerald-400" />,
              title: "Communauté",
              description: "Apprenez, échangez et grandissez avec des musiciens du monde entier."
            }
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-16 h-16 rounded-xl bg-foreground/5 border border-border flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold font-heading mb-6 flex items-center gap-3">
              <Music className="w-8 h-8 text-purple-400" />
              La vision Atyef
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Atyef est née d'un constat simple : l'apprentissage traditionnel de la musique peut souvent sembler rigide et inaccessible. Nous avons voulu créer un espace où la rigueur académique rencontre la flexibilité du numérique.
              </p>
              <p>
                Que vous souhaitiez gratouiller quelques accords au coin du feu ou maîtriser des sonates complexes, notre plateforme a été pensée pour s'adapter à <strong className="text-foreground font-medium">votre rythme</strong> et à <strong className="text-foreground font-medium">vos objectifs</strong>.
              </p>
              <p>
                Aujourd'hui, Atyef met en relation des professeurs passionnés avec des milliers d'élèves, brisant les frontières pour créer la plus belle des symphonies : celle du partage.
              </p>
            </div>
            
            <div className="mt-10 flex items-center gap-4 p-4 rounded-xl bg-foreground/[0.02] border border-border">
              <Shield className="w-6 h-6 text-emerald-400 shrink-0" />
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
