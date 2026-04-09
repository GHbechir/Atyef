"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Upload, Image as ImageIcon, Save, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { INSTRUMENTS } from "@/lib/mock-data";

export default function NewCoursePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/teach/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour aux cours
        </Link>
        <h1 className="text-2xl font-bold font-heading text-white mb-1">Créer un nouveau cours</h1>
        <p className="text-muted-foreground text-sm">Remplissez les informations pour publier votre cours.</p>
      </motion.div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Basic Info */}
        <motion.div className="glass-card rounded-xl p-6 space-y-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h3 className="text-base font-semibold text-white">Informations générales</h3>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Titre du cours *</Label>
            <Input placeholder="Ex. : Piano Jazz pour Débutants" className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Description *</Label>
            <Textarea placeholder="Décrivez votre cours en détail..." className="bg-white/5 border-white/10 text-white min-h-[120px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Instrument *</Label>
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {INSTRUMENTS.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>{inst.icon} {inst.name.split(" / ")[0]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Niveau *</Label>
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Débutant</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermédiaire</SelectItem>
                  <SelectItem value="ADVANCED">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Style musical</Label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {["Classique", "Jazz", "Rock", "Pop", "Blues", "Metal", "Folk", "Électronique", "Autre"].map((s) => (
                  <SelectItem key={s} value={s.toUpperCase()}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Thumbnail */}
        <motion.div className="glass-card rounded-xl p-6 space-y-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-base font-semibold text-white">Miniature du cours</h3>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/30 transition-colors cursor-pointer">
            <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">Glissez une image ici ou cliquez pour parcourir</p>
            <p className="text-xs text-muted-foreground">PNG, JPG ou WebP (max. 5 Mo, 16:9 recommandé)</p>
            <Button variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/5" size="sm">
              <Upload className="w-3.5 h-3.5 mr-2" /> Parcourir
            </Button>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div className="glass-card rounded-xl p-6 space-y-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-base font-semibold text-white">Tarification</h3>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10 py-1 px-3">
              Inclus dans l&apos;abonnement
            </Badge>
            <span className="text-xs text-muted-foreground">Les abonnés Basic et VIP auront accès à ce cours</span>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Prix à l&apos;unité (optionnel, pour les non-abonnés)</Label>
            <div className="relative max-w-xs">
              <Input type="number" placeholder="29.90" className="bg-white/5 border-white/10 text-white pl-8" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex items-center gap-3 pt-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button className="gradient-bg text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20 flex-1 sm:flex-none">
            <Save className="w-4 h-4 mr-2" /> Enregistrer le brouillon
          </Button>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 flex-1 sm:flex-none">
            <Eye className="w-4 h-4 mr-2" /> Aperçu
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
