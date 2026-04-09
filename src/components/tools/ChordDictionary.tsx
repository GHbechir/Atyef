"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Chord = {
  name: string;
  fullName: string;
  notes: string[];
  frets: (number | null)[]; // null = muted, 0 = open
  fingers: (number | null)[];
  barreAt?: number;
  category: "major" | "minor" | "7th" | "other";
};

const CHORDS: Chord[] = [
  // Majeurs
  { name: "C", fullName: "Do Majeur", notes: ["C", "E", "G"], frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, 0, 1, 0], category: "major" },
  { name: "D", fullName: "Ré Majeur", notes: ["D", "F#", "A"], frets: [null, null, 0, 2, 3, 2], fingers: [null, null, 0, 1, 3, 2], category: "major" },
  { name: "E", fullName: "Mi Majeur", notes: ["E", "G#", "B"], frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], category: "major" },
  { name: "F", fullName: "Fa Majeur", notes: ["F", "A", "C"], frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barreAt: 1, category: "major" },
  { name: "G", fullName: "Sol Majeur", notes: ["G", "B", "D"], frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], category: "major" },
  { name: "A", fullName: "La Majeur", notes: ["A", "C#", "E"], frets: [null, 0, 2, 2, 2, 0], fingers: [null, 0, 1, 2, 3, 0], category: "major" },
  { name: "B", fullName: "Si Majeur", notes: ["B", "D#", "F#"], frets: [null, 2, 4, 4, 4, 2], fingers: [null, 1, 2, 3, 4, 1], barreAt: 2, category: "major" },
  // Mineurs
  { name: "Am", fullName: "La mineur", notes: ["A", "C", "E"], frets: [null, 0, 2, 2, 1, 0], fingers: [null, 0, 2, 3, 1, 0], category: "minor" },
  { name: "Dm", fullName: "Ré mineur", notes: ["D", "F", "A"], frets: [null, null, 0, 2, 3, 1], fingers: [null, null, 0, 2, 3, 1], category: "minor" },
  { name: "Em", fullName: "Mi mineur", notes: ["E", "G", "B"], frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], category: "minor" },
  { name: "Fm", fullName: "Fa mineur", notes: ["F", "Ab", "C"], frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barreAt: 1, category: "minor" },
  { name: "Bm", fullName: "Si mineur", notes: ["B", "D", "F#"], frets: [null, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 4, 2, 1], barreAt: 2, category: "minor" },
  // Septièmes
  { name: "C7", fullName: "Do 7ème", notes: ["C", "E", "G", "Bb"], frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, 0], category: "7th" },
  { name: "G7", fullName: "Sol 7ème", notes: ["G", "B", "D", "F"], frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], category: "7th" },
  { name: "D7", fullName: "Ré 7ème", notes: ["D", "F#", "A", "C"], frets: [null, null, 0, 2, 1, 2], fingers: [null, null, 0, 2, 1, 3], category: "7th" },
  { name: "A7", fullName: "La 7ème", notes: ["A", "C#", "E", "G"], frets: [null, 0, 2, 0, 2, 0], fingers: [null, 0, 2, 0, 3, 0], category: "7th" },
  { name: "E7", fullName: "Mi 7ème", notes: ["E", "G#", "B", "D"], frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], category: "7th" },
];

const STRINGS = ["E", "A", "D", "G", "B", "e"];

function GuitarDiagram({ chord }: { chord: Chord }) {
  const maxFret = Math.max(...chord.frets.filter((f): f is number => f !== null && f > 0), 0);
  const minFret = Math.min(...chord.frets.filter((f): f is number => f !== null && f > 0), maxFret);
  const startFret = minFret <= 3 ? 1 : minFret;
  const numFrets = Math.max(4, maxFret - startFret + 1);

  return (
    <div className="flex flex-col items-center">
      {/* Chord Name */}
      <h3 className="text-xl font-bold text-white mb-1">{chord.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">{chord.fullName}</p>

      <svg viewBox={`-10 -20 140 ${numFrets * 30 + 30}`} className="w-44">
        {/* Nut (if starting at fret 1) */}
        {startFret === 1 && (
          <rect x="10" y="0" width="110" height="4" fill="white" rx="2" />
        )}

        {/* Fret number indicator */}
        {startFret > 1 && (
          <text x="0" y="20" fill="#9ca3af" fontSize="10" textAnchor="end">{startFret}</text>
        )}

        {/* Strings */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`s${i}`} x1={10 + i * 22} y1="0" x2={10 + i * 22} y2={numFrets * 30} stroke="#666" strokeWidth="1.5" />
        ))}

        {/* Frets */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <line key={`f${i}`} x1="10" y1={i * 30} x2="120" y2={i * 30} stroke="#444" strokeWidth={i === 0 && startFret === 1 ? 0 : 1} />
        ))}

        {/* Barre */}
        {chord.barreAt && (
          <rect
            x={8}
            y={(chord.barreAt - startFret) * 30 + 10}
            width={112}
            height={10}
            rx={5}
            fill="#8B5CF6"
            opacity={0.6}
          />
        )}

        {/* Finger positions */}
        {chord.frets.map((fret, i) => {
          if (fret === null) {
            return <text key={i} x={10 + i * 22} y="-8" fill="#EF4444" fontSize="12" textAnchor="middle">×</text>;
          }
          if (fret === 0) {
            return <circle key={i} cx={10 + i * 22} cy={-8} r="5" fill="none" stroke="#10B981" strokeWidth="2" />;
          }
          return (
            <circle
              key={i}
              cx={10 + i * 22}
              cy={(fret - startFret) * 30 + 15}
              r="8"
              fill="#8B5CF6"
            />
          );
        })}
      </svg>

      {/* Notes */}
      <div className="flex gap-1 mt-2">
        {chord.notes.map((note) => (
          <span key={note} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChordDictionary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = CHORDS.filter((chord) => {
    const matchesSearch =
      chord.name.toLowerCase().includes(search.toLowerCase()) ||
      chord.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || chord.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un accord..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <Select value={category} onValueChange={(val) => val && setCategory(val)}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="major">Majeurs</SelectItem>
            <SelectItem value="minor">Mineurs</SelectItem>
            <SelectItem value="7th">Septièmes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((chord) => (
          <div
            key={chord.name}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/8 transition-all duration-300 flex flex-col items-center"
          >
            <GuitarDiagram chord={chord} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">🤷</p>
          <p className="text-muted-foreground">Aucun accord trouvé</p>
        </div>
      )}
    </div>
  );
}
