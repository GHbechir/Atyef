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
  Headphones,
  Zap,
  Globe,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INSTRUMENTS_SHOWCASE = [
  { icon: "🎹", name: "Piano", color: "#6C3CE1" },
  { icon: "🎸", name: "Guitare", color: "#F59E0B" },
  { icon: "🪕", name: "Oud", color: "#D97706" },
  { icon: "🥁", name: "Darbuka", color: "#DC2626" },
  { icon: "🎻", name: "Violon", color: "#8B5CF6" },
  { icon: "🎵", name: "Ney", color: "#059669" },
  { icon: "🎶", name: "Qanun", color: "#7C3AED" },
  { icon: "🎤", name: "Chant", color: "#EC4899" },
  { icon: "🎷", name: "Saxophone", color: "#F97316" },
  { icon: "🎧", name: "MAO", color: "#A855F7" },
  { icon: "📖", name: "Maqamât", color: "#64748B" },
  { icon: "🎸", name: "Basse", color: "#10B981" },
];

const TESTIMONIALS = [
  {
    text: "Grâce à Atyef, j'ai appris le oud en 6 mois. Les cours de maqamât sont incroyables !",
    name: "Youssef Ben Ali",
    role: "Apprenant Oud",
    avatar: "Y",
  },
  {
    text: "La meilleure plateforme pour apprendre la musique orientale et occidentale. Le lecteur de partition est un game-changer.",
    name: "Sarah Mansouri",
    role: "Apprenante Piano & Qanun",
    avatar: "S",
  },
  {
    text: "En tant que prof, l'espace enseignant est complet. Mes élèves progressent 2x plus vite avec les outils interactifs.",
    name: "Karim Trabelsi",
    role: "Professeur de Darbuka",
    avatar: "K",
  },
];

const STATS = [
  { value: "15K+", label: "Apprenants", icon: Users },
  { value: "200+", label: "Cours", icon: BookOpen },
  { value: "50+", label: "Professeurs", icon: GraduationCap },
  { value: "13", label: "Instruments", icon: Music2 },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* ====== HERO ====== */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-float delay-300" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-float delay-500" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                🎶 Nouvelle plateforme — Musique Occidentale & Orientale
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6 leading-[1.1]"
              >
                Apprenez la musique
                <br />
                avec{" "}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                  Atyef
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
              >
                La première plateforme qui fusionne l'apprentissage de la musique
                <strong className="text-white"> occidentale et orientale</strong>.
                Piano, Guitare, <strong className="text-amber-400">Oud</strong>,{" "}
                <strong className="text-red-400">Darbuka</strong>,{" "}
                <strong className="text-emerald-400">Ney</strong>,{" "}
                <strong className="text-purple-400">Qanun</strong> et plus.
                Cours vidéo, partitions interactives et outils MIDI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link href="/sign-up">
                  <Button className="h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border-0 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button
                    variant="outline"
                    className="h-14 px-8 text-lg bg-white/5 hover:bg-white/10 border-white/10 transition-all hover:scale-105 backdrop-blur-sm group"
                  >
                    <Play className="mr-2 w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                    Explorer les cours
                  </Button>
                </Link>
              </motion.div>

              {/* Mini stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mt-10 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <strong className="text-white">4.9</strong>/5 avis
                </span>
                <span className="w-px h-4 bg-white/10" />
                <span>15,000+ apprenants</span>
                <span className="w-px h-4 bg-white/10" />
                <span>200+ cours</span>
              </motion.div>
            </div>

            {/* Right: Instrument Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-4 gap-3">
                {INSTRUMENTS_SHOWCASE.map((inst, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                    className="glass-card p-4 rounded-2xl text-center cursor-pointer transition-all hover:shadow-lg group"
                    style={{
                      borderColor: `${inst.color}20`,
                    }}
                  >
                    <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">
                      {inst.icon}
                    </span>
                    <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                      {inst.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== INSTRUMENTS SCROLL (mobile) ====== */}
      <section className="lg:hidden py-6 overflow-hidden">
        <div className="flex gap-3 animate-scroll px-4">
          {[...INSTRUMENTS_SHOWCASE, ...INSTRUMENTS_SHOWCASE].map((inst, i) => (
            <div
              key={i}
              className="glass-card px-4 py-3 rounded-xl flex items-center gap-2 shrink-0"
            >
              <span className="text-xl">{inst.icon}</span>
              <span className="text-sm text-white/80">{inst.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="py-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 flex justify-around">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold font-heading bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <stat.icon className="w-3.5 h-3.5" />
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-purple-300 border-purple-500/30 bg-purple-500/5">
              <Sparkles className="w-3 h-3 mr-1" /> Fonctionnalités
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              Pourquoi choisir <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Atyef</span> ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              La plateforme musicale la plus complète, conçue pour les musiciens du monde entier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="w-7 h-7 text-amber-400" />,
                title: "Musique Orientale & Occidentale",
                description:
                  "Oud, Darbuka, Ney, Qanun, Piano, Guitare... La seule plateforme qui couvre les deux traditions.",
                gradient: "from-amber-500/10 to-orange-500/10",
              },
              {
                icon: <Music2 className="w-7 h-7 text-purple-400" />,
                title: "Partitions Interactives",
                description:
                  "Lecteur de partition avec notation musicale, tablatures défilantes style Yousician et lecteur MIDI.",
                gradient: "from-purple-500/10 to-violet-500/10",
              },
              {
                icon: <Headphones className="w-7 h-7 text-cyan-400" />,
                title: "10 Outils Musicaux",
                description:
                  "Piano virtuel, drum machine, gammes, accords, métronome, accordeur et enregistreur audio intégrés.",
                gradient: "from-cyan-500/10 to-blue-500/10",
              },
              {
                icon: <Users className="w-7 h-7 text-emerald-400" />,
                title: "Professeurs d'Exception",
                description:
                  "Apprenez avec des maîtres comme Anouar Brahem (Oud), Lotfi Bouchnak (Maqamât) et bien d'autres.",
                gradient: "from-emerald-500/10 to-green-500/10",
              },
              {
                icon: <Zap className="w-7 h-7 text-yellow-400" />,
                title: "Gamification & Progression",
                description:
                  "Système XP, badges, séries quotidiennes et suivi de progression pour rester motivé.",
                gradient: "from-yellow-500/10 to-amber-500/10",
              },
              {
                icon: <Trophy className="w-7 h-7 text-rose-400" />,
                title: "Mode Pratique MIDI",
                description:
                  "Connectez un clavier MIDI USB ou utilisez le microphone pour pratiquer avec feedback en temps réel.",
                gradient: "from-rose-500/10 to-pink-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card p-7 rounded-2xl hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br ${feature.gradient}`}
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ORIENTAL SECTION ====== */}
      <section className="py-24 bg-gradient-to-b from-amber-900/5 to-transparent border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 text-amber-300 border-amber-500/30 bg-amber-500/5">
                🌙 Musique Orientale
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Explorez la richesse de la musique{" "}
                <span className="text-amber-400">arabe et tunisienne</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Atyef est la première plateforme à proposer des cours complets de musique orientale.
                Apprenez les <strong className="text-white">maqamât</strong> (modes musicaux arabes),
                maîtrisez le <strong className="text-amber-400">oud</strong>, la{" "}
                <strong className="text-red-400">darbuka</strong> et le{" "}
                <strong className="text-emerald-400">ney</strong> avec des maîtres reconnus.
              </p>
              <div className="space-y-3">
                {[
                  "Maqam Rast, Bayati, Saba, Hijaz, Nahawand",
                  "Rythmes : Maqsoum, Saidi, Foukha, Ciftetelli",
                  "Répertoire classique et malouf tunisien",
                  "Taqsim, Wasla et improvisation orientale",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </span>
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: "🪕", name: "Oud", courses: 16, color: "#D97706" },
                { icon: "🥁", name: "Darbuka", courses: 12, color: "#DC2626" },
                { icon: "🎵", name: "Ney", courses: 8, color: "#059669" },
                { icon: "🎶", name: "Qanun", courses: 6, color: "#7C3AED" },
              ].map((inst, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 rounded-2xl text-center"
                  style={{ borderColor: `${inst.color}25` }}
                >
                  <span className="text-5xl block mb-3">{inst.icon}</span>
                  <h3 className="text-lg font-bold text-white mb-1">{inst.name}</h3>
                  <p className="text-xs text-muted-foreground">{inst.courses} cours disponibles</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-cyan-300 border-cyan-500/30 bg-cyan-500/5">
              <Star className="w-3 h-3 mr-1" /> Témoignages
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              Ils apprennent avec Atyef
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/80 mb-6 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-black/50 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-8">
              <Music2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
              Prêt à révéler votre talent ?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Rejoignez des milliers de musiciens qui ont déjà transformé leur façon d'apprendre.
              <strong className="text-white"> 7 jours d'essai gratuit</strong>, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-up">
                <Button className="h-14 px-10 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border-0 shadow-lg transition-all hover:scale-105">
                  Commencer l'essai gratuit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-14 px-10 text-lg border-white/10 hover:bg-white/10 transition-all hover:scale-105 text-white"
                >
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-white/5 py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                  <Music2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold font-heading">
                  Aty<span className="text-emerald-400">ef</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La plateforme d'apprentissage musical qui fusionne Orient et Occident.
              </p>
            </div>

            {[
              {
                title: "Instruments",
                links: ["Piano", "Guitare", "Oud", "Darbuka", "Ney", "Violon"],
              },
              {
                title: "Plateforme",
                links: ["Cours", "Partitions", "Outils", "Tarifs", "Blog"],
              },
              {
                title: "Support",
                links: ["Aide", "Contact", "CGU", "Politique de confidentialité"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <span className="text-sm text-muted-foreground hover:text-white cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Atyef. Tous droits réservés. 🇹🇳
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Fait avec ❤️ en Tunisie</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
