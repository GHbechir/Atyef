"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold font-heading text-white">Outils</h1>
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
            10 outils
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Tablature interactive, piano virtuel, lecteur MIDI, gammes, accords, enregistreur et plus.
        </p>
      </motion.div>

      <Tabs defaultValue="guitar-tab" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full flex flex-wrap h-auto gap-1">
          <TabsTrigger
            value="guitar-tab"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎸 Tablature
          </TabsTrigger>
          <TabsTrigger
            value="sheet-music"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            📜 Partition
          </TabsTrigger>
          <TabsTrigger
            value="piano"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎹 Piano
          </TabsTrigger>
          <TabsTrigger
            value="midi"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎼 MIDI
          </TabsTrigger>
          <TabsTrigger
            value="scales"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎵 Gammes
          </TabsTrigger>
          <TabsTrigger
            value="drums"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🥁 Drum Machine
          </TabsTrigger>
          <TabsTrigger
            value="chords"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎸 Accords
          </TabsTrigger>
          <TabsTrigger
            value="recorder"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎙️ Enregistreur
          </TabsTrigger>
          <TabsTrigger
            value="metronome"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            ⏱️ Métronome
          </TabsTrigger>
          <TabsTrigger
            value="tuner"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎯 Accordeur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guitar-tab" className="mt-6">
          <div className="max-w-5xl mx-auto">
            <GuitarTabPlayer />
          </div>
        </TabsContent>

        <TabsContent value="sheet-music" className="mt-6">
          <div className="max-w-5xl mx-auto">
            <SheetMusicViewer />
          </div>
        </TabsContent>

        <TabsContent value="piano" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <VirtualPiano />
          </div>
        </TabsContent>

        <TabsContent value="midi" className="mt-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Sélectionnez un morceau de démonstration ou connectez un clavier MIDI USB pour le mode pratique
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {Object.entries(DEMO_SONGS).map(([key, song]) => (
                <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-sm font-medium text-white truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.bpm} BPM • {song.notes.length} notes</p>
                </div>
              ))}
            </div>
            <MidiPlayer
              notes={DEMO_SONGS["fur-elise"].notes}
              title={DEMO_SONGS["fur-elise"].title}
              bpm={DEMO_SONGS["fur-elise"].bpm}
            />
          </div>
        </TabsContent>

        <TabsContent value="scales" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <ScalesReference />
          </div>
        </TabsContent>

        <TabsContent value="drums" className="mt-6">
          <div className="max-w-4xl mx-auto">
            <DrumMachine />
          </div>
        </TabsContent>

        <TabsContent value="chords" className="mt-6">
          <ChordDictionary />
        </TabsContent>

        <TabsContent value="recorder" className="mt-6">
          <div className="max-w-xl mx-auto">
            <AudioRecorder />
          </div>
        </TabsContent>

        <TabsContent value="metronome" className="mt-6">
          <div className="max-w-lg mx-auto">
            <Metronome />
          </div>
        </TabsContent>

        <TabsContent value="tuner" className="mt-6">
          <div className="max-w-lg mx-auto">
            <Tuner />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
