"use client";

import { useState } from "react";
import { Search, Music, Play, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock songs data
const MOCK_SONGS = [
  { id: "1", title: "Lettre à Élise", artist: "Beethoven", genre: "Classique", level: "BEGINNER", instrument: "Piano", color: "#6C3CE1" },
  { id: "2", title: "Imagine", artist: "John Lennon", genre: "Pop", level: "BEGINNER", instrument: "Piano", color: "#6C3CE1" },
  { id: "3", title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "Rock", level: "INTERMEDIATE", instrument: "Guitare", color: "#F59E0B" },
  { id: "4", title: "Wonderwall", artist: "Oasis", genre: "Pop", level: "BEGINNER", instrument: "Guitare", color: "#F59E0B" },
  { id: "5", title: "Hotel California", artist: "Eagles", genre: "Rock", level: "INTERMEDIATE", instrument: "Guitare", color: "#F59E0B" },
  { id: "6", title: "Comptine d'un autre été", artist: "Yann Tiersen", genre: "Classique", level: "INTERMEDIATE", instrument: "Piano", color: "#6C3CE1" },
  { id: "7", title: "Come Together", artist: "The Beatles", genre: "Rock", level: "INTERMEDIATE", instrument: "Basse", color: "#10B981" },
  { id: "8", title: "Another One Bites the Dust", artist: "Queen", genre: "Rock", level: "BEGINNER", instrument: "Basse", color: "#10B981" },
  { id: "9", title: "Back in Black", artist: "AC/DC", genre: "Rock", level: "BEGINNER", instrument: "Batterie", color: "#EF4444" },
  { id: "10", title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", level: "ADVANCED", instrument: "Chant", color: "#EC4899" },
  { id: "11", title: "Hallelujah", artist: "Leonard Cohen", genre: "Pop", level: "BEGINNER", instrument: "Chant", color: "#EC4899" },
  { id: "12", title: "Canon in D", artist: "Pachelbel", genre: "Classique", level: "INTERMEDIATE", instrument: "Piano", color: "#6C3CE1" },
];

const levelLabels: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

export default function SongsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");

  const filteredSongs = MOCK_SONGS.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInstrument = filterInstrument === "all" || song.instrument === filterInstrument;
    const matchesLevel = filterLevel === "all" || song.level === filterLevel;
    const matchesGenre = filterGenre === "all" || song.genre === filterGenre;
    return matchesSearch && matchesInstrument && matchesLevel && matchesGenre;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-white mb-2">
          🎵 Bibliothèque de Chansons
        </h1>
        <p className="text-muted-foreground">
          Entraînez-vous avec des morceaux populaires adaptés à votre niveau
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une chanson ou un artiste..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-3">
          <Select value={filterInstrument} onValueChange={(val) => val && setFilterInstrument(val)}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
              <SelectValue placeholder="Instrument" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Piano">Piano</SelectItem>
              <SelectItem value="Guitare">Guitare</SelectItem>
              <SelectItem value="Basse">Basse</SelectItem>
              <SelectItem value="Batterie">Batterie</SelectItem>
              <SelectItem value="Chant">Chant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterLevel} onValueChange={(val) => val && setFilterLevel(val)}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              <SelectItem value="BEGINNER">Débutant</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermédiaire</SelectItem>
              <SelectItem value="ADVANCED">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredSongs.length} chanson{filteredSongs.length > 1 ? "s" : ""} trouvée{filteredSongs.length > 1 ? "s" : ""}
      </p>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-300 cursor-pointer"
          >
            {/* Album art placeholder */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `${song.color}20` }}
            >
              <Music className="w-6 h-6" style={{ color: song.color }} />
            </div>

            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate group-hover:text-primary transition-colors">
                {song.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${song.color}20`, color: song.color }}
                >
                  {song.instrument}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground font-medium">
                  {levelLabels[song.level]}
                </span>
              </div>
            </div>

            {/* Play button */}
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </button>
          </div>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg text-white font-medium mb-1">Aucune chanson trouvée</p>
          <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}
