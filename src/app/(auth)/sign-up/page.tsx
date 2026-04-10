"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Music2, ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignUpPage() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 music-pattern relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading">
              <span className="font-bold text-xl tracking-tight">Aty<span className="gradient-text-purple">ef</span></span>
            </span>
          </div>

          <h1 className="text-2xl font-bold font-heading text-center text-white mb-2">
            Créez votre compte
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Commencez gratuitement votre apprentissage sur Atyef
          </p>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator className="bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-muted-foreground bg-[oklch(0.16_0.015_280)]">
              ou
            </span>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl mb-6">
            <button
              onClick={() => setAuthMode("phone")}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-all ${
                authMode === "phone" ? "bg-white/10 text-white shadow" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4" />
              Téléphone
            </button>
            <button
              onClick={() => setAuthMode("email")}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-all ${
                authMode === "email" ? "bg-white/10 text-white shadow" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-muted-foreground">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Prénom"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-muted-foreground">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Nom"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>
            </div>
            {authMode === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-muted-foreground">
                  Numéro de téléphone
                </Label>
                <div className="flex focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-0 rounded-md">
                  <div className="flex items-center justify-center px-4 bg-white/10 border border-r-0 border-white/10 text-white font-medium rounded-l-md h-11">
                    <span className="text-xl mr-2">🇹🇳</span>
                    +216
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="55 123 456"
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="8 caractères minimum"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm text-muted-foreground">Je suis</Label>
              <Select defaultValue="LEARNER">
                <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEARNER">🎵 Un apprenant</SelectItem>
                  <SelectItem value="TEACHER">🎓 Un professeur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link href="/learn">
              <Button className="w-full h-11 gradient-bg text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20 font-medium mt-2">
                Créer mon compte
              </Button>
            </Link>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">conditions d&apos;utilisation</Link>
            {" "}et notre{" "}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">politique de confidentialité</Link>.
          </p>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Déjà un compte ?{" "}
            <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
