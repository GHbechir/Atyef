"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metronome } from "@/components/tools/Metronome";
import { Tuner } from "@/components/tools/Tuner";
import { VirtualPiano } from "@/components/tools/VirtualPiano";
import { DrumMachine } from "@/components/tools/DrumMachine";
import { ChordDictionary } from "@/components/tools/ChordDictionary";
import { AudioRecorder } from "@/components/tools/AudioRecorder";
import { ScalesReference } from "@/components/tools/ScalesReference";
import { MidiPlayer, DEMO_SONGS } from "@/components/tools/MidiPlayer";
import { GuitarTabPlayer } from "@/components/tools/GuitarTabPlayer";
import { SheetMusicViewer } from "@/components/tools/SheetMusicViewer";
import { PerformanceRecorder } from "@/components/tools/PerformanceRecorder";

export default function ToolsPage() {
  const toolCategories = [
    { title: "Pratique Instrumentale", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", glow: "hover:shadow-purple-500/20", tools: [
      { id: "guitar-tab", name: "Tablature Interactive", icon: "🎸", desc: "Jouez avec des tablatures défilantes et son MIDI.", component: GuitarTabPlayer },
      { id: "sheet-music", name: "Partition", icon: "📜", desc: "Lisez et suivez les partitions classiques.", component: SheetMusicViewer },
      { id: "piano", name: "Piano Virtuel", icon: "🎹", desc: "Pratiquez sur un clavier interactif 88 touches.", component: VirtualPiano },
    ]},
    { title: "Rythme & Harmonie", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", glow: "hover:shadow-emerald-500/20", tools: [
      { id: "metronome", name: "Métronome", icon: "⏱️", desc: "Gardez le tempo parfait avec subdivisions.", component: Metronome },
      { id: "drums", name: "Drum Machine", icon: "🥁", desc: "Créez des boucles rythmiques pour vous accompagner.", component: DrumMachine },
      { id: "chords", name: "Dictionnaire d'Accords", icon: "🎸", desc: "Trouvez n'importe quel accord au piano ou guitare.", component: ChordDictionary },
      { id: "scales", name: "Gammes", icon: "🎵", desc: "Explorez les modes et gammes pour improviser.", component: ScalesReference },
    ]},
    { title: "Utilitaires & Audio", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", glow: "hover:shadow-amber-500/20", tools: [
      { id: "tuner", name: "Accordeur", icon: "🎯", desc: "Accordez chromatiquement votre instrument.", component: Tuner },
      { id: "recorder", name: "Enregistreur", icon: "🎙️", desc: "Maquettez vos idées rapidement en audio.", component: AudioRecorder },
      { id: "midi", name: "Lecteur MIDI", icon: "🎼", desc: "Analysez et écoutez des fichiers MIDI standards.", component: () => (
        <div className="space-y-4">
          <MidiPlayer notes={DEMO_SONGS["fur-elise"].notes} title={DEMO_SONGS["fur-elise"].title} bpm={DEMO_SONGS["fur-elise"].bpm} />
        </div>
      ) },
    ]}
  ];

  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (activeTool) {
    const ActiveComponent = toolCategories.flatMap(c => c.tools).find(t => t.id === activeTool)?.component;
    return (
      <div className="space-y-6">
         <div className="flex items-center gap-4 border-b border-border/40 pb-4">
           <Button variant="ghost" onClick={() => setActiveTool(null)} className="h-8 hover:bg-foreground/5 text-muted-foreground hover:text-foreground -ml-2">
             ← Retour au Studio
           </Button>
         </div>
         <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-background rounded-2xl relative">
            {ActiveComponent && <ActiveComponent />}
         </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold font-heading text-foreground">Le Studio</h1>
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
            10 outils
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Votre boîte à outils musicale digitale. Tout ce qu'il faut pour s'entraîner, sans matériel externe.
        </p>
      </motion.div>

      <div className="space-y-10">
        {toolCategories.map((category, idx) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 font-heading">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`stat-card p-5 text-left group transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br border ${category.color} ${category.border} ${category.glow}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-2xl mb-4 group-hover:bg-foreground/10 transition-colors">
                    {tool.icon}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-accent transition-colors">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
