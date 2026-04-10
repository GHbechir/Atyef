"use client";

import { useState } from "react";
import { Search, Music, FileMusic, Download, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MidiPlayer, DEMO_SONGS } from "@/components/tools/MidiPlayer";

type Partition = {
  id: string;
  title: string;
  composer: string;
  instrument: string;
  level: string;
  style: string;
  hasMidi: boolean;
  partitionCount: number;
  color: string;
  songKey: string | null;
};

const PARTITIONS: Partition[] = [
  { id: "1", title: "Für Elise", composer: "Ludwig van Beethoven", instrument: "Piano", level: "Débutant - Intermédiaire", style: "Classique", hasMidi: true, partitionCount: 3, color: "#6C3CE1", songKey: "fur-elise" },
  { id: "2", title: "Ah! Vous dirai-je Maman", composer: "Wolfgang A. Mozart", instrument: "Piano", level: "Débutant", style: "Classique", hasMidi: true, partitionCount: 13, color: "#6C3CE1", songKey: "twinkle" },
  { id: "3", title: "Hymne à la Joie", composer: "Ludwig van Beethoven", instrument: "Piano", level: "Débutant", style: "Classique", hasMidi: true, partitionCount: 1, color: "#6C3CE1", songKey: "ode-to-joy" },
  { id: "4", title: "Stairway to Heaven", composer: "Led Zeppelin", instrument: "Guitare", level: "Intermédiaire", style: "Rock", hasMidi: false, partitionCount: 2, color: "#F59E0B", songKey: null },
  { id: "5", title: "Come Together", composer: "The Beatles", instrument: "Basse", level: "Intermédiaire", style: "Rock", hasMidi: false, partitionCount: 1, color: "#10B981", songKey: null },
  { id: "6", title: "Comptine d'un autre été", composer: "Yann Tiersen", instrument: "Piano", level: "Intermédiaire", style: "Classique", hasMidi: false, partitionCount: 2, color: "#6C3CE1", songKey: null },
  { id: "7", title: "Hotel California", composer: "Eagles", instrument: "Guitare", level: "Intermédiaire", style: "Rock", hasMidi: false, partitionCount: 3, color: "#F59E0B", songKey: null },
  { id: "8", title: "Canon in D", composer: "Johann Pachelbel", instrument: "Piano", level: "Intermédiaire", style: "Classique", hasMidi: false, partitionCount: 1, color: "#6C3CE1", songKey: null },
];

export default function PartitionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStyle, setFilterStyle] = useState("all");
  const [selectedPartition, setSelectedPartition] = useState<Partition | null>(null);

  const filtered = PARTITIONS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.composer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInstrument = filterInstrument === "all" || p.instrument === filterInstrument;
    const matchesLevel = filterLevel === "all" || p.level.includes(filterLevel);
    const matchesStyle = filterStyle === "all" || p.style === filterStyle;
    return matchesSearch && matchesInstrument && matchesLevel && matchesStyle;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-white mb-2">
          🎼 Partitions
        </h1>
        <p className="text-muted-foreground">
          Bibliothèque de partitions et fichiers MIDI pour tous les instruments
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, compositeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={filterInstrument} onValueChange={(val) => val && setFilterInstrument(val)}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Instrument" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Piano">Piano</SelectItem>
              <SelectItem value="Guitare">Guitare</SelectItem>
              <SelectItem value="Basse">Basse</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStyle} onValueChange={(val) => val && setFilterStyle(val)}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous styles</SelectItem>
              <SelectItem value="Classique">Classique</SelectItem>
              <SelectItem value="Rock">Rock</SelectItem>
              <SelectItem value="Jazz">Jazz</SelectItem>
              <SelectItem value="Pop">Pop</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterLevel} onValueChange={(val) => val && setFilterLevel(val)}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              <SelectItem value="Débutant">Débutant</SelectItem>
              <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
              <SelectItem value="Confirmé">Confirmé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MIDI Player (when partition selected) */}
      {selectedPartition && selectedPartition.songKey && DEMO_SONGS[selectedPartition.songKey] && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              🎹 {selectedPartition.title}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedPartition(null)} className="text-xs">
              Fermer ✕
            </Button>
          </div>
          <MidiPlayer
            notes={DEMO_SONGS[selectedPartition.songKey].notes}
            title={DEMO_SONGS[selectedPartition.songKey].title}
            bpm={DEMO_SONGS[selectedPartition.songKey].bpm}
          />
        </div>
      )}

      {/* Results */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} partition{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
      </p>

      {/* Partitions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((partition) => (
          <div
            key={partition.id}
            className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer"
            onClick={() => partition.hasMidi && setSelectedPartition(partition)}
          >
            {/* Cover */}
            <div
              className="h-36 flex items-center justify-center relative"
              style={{ backgroundColor: `${partition.color}12` }}
            >
              {partition.hasMidi && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold bg-black/50 text-white flex items-center gap-1">
                  <FileMusic className="w-3 h-3" /> MIDI
                </div>
              )}
              <div className="text-center">
                <Music className="w-10 h-10 mx-auto mb-2" style={{ color: partition.color }} />
                <p className="text-xs text-muted-foreground">{partition.partitionCount} Partition{partition.partitionCount > 1 ? "s" : ""} - {partition.instrument}</p>
              </div>
              {partition.hasMidi && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm group-hover:text-primary transition-colors line-clamp-1">
                {partition.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{partition.composer}</p>
              <div className="mt-3">
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: `${partition.color}25`, color: partition.color }}
                >
                  {partition.level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🎼</p>
          <p className="text-lg text-white font-medium mb-1">Aucune partition trouvée</p>
          <p className="text-sm text-muted-foreground">Modifiez vos filtres</p>
        </div>
      )}
    </div>
  );
}
