"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Play, Pause, Square, SkipBack, Volume2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { playInstrumentNote, INSTRUMENT_INFO, type InstrumentType } from "@/lib/instruments";

// ===== TYPES =====
type ScoreNote = {
  midi: number;
  time: number;     // in beats
  duration: number;  // in beats
  velocity: number;
};

type Track = {
  instrument: InstrumentType;
  name: string;
  notes: ScoreNote[];
  muted: boolean;
};

type Score = {
  title: string;
  composer: string;
  bpm: number;
  timeSignature: [number, number];
  tracks: Track[];
};

// ===== NOTE HELPERS =====
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FR: Record<string, string> = {
  C: "Do", D: "Ré", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si",
};

function midiToNoteName(midi: number): string {
  return NOTE_NAMES[midi % 12];
}

function midiToOctave(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

// Position on staff (treble clef, middle C = 0, each step = half line)
function midiToStaffPos(midi: number, clef: "treble" | "bass"): number {
  const note = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  // Map each note to a diatonic position (0 = C)
  const diatonicPositions = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]; // C C# D D# E F F# G G# A A# B
  const pos = diatonicPositions[note] + (octave - 4) * 7;

  if (clef === "treble") {
    return pos; // 0 = C4 (middle C, one ledger line below)
  } else {
    return pos + 12; // Bass clef: shift up
  }
}

function isSharp(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(midi % 12);
}

// ===== DEMO SCORES =====
const DEMO_SCORES: Record<string, Score> = {
  "fur-elise": {
    title: "Für Elise",
    composer: "Ludwig van Beethoven",
    bpm: 120,
    timeSignature: [3, 8],
    tracks: [
      {
        instrument: "piano",
        name: "Piano (Main droite)",
        muted: false,
        notes: [
          { midi: 76, time: 0, duration: 0.5, velocity: 0.8 },
          { midi: 75, time: 0.5, duration: 0.5, velocity: 0.8 },
          { midi: 76, time: 1, duration: 0.5, velocity: 0.8 },
          { midi: 75, time: 1.5, duration: 0.5, velocity: 0.8 },
          { midi: 76, time: 2, duration: 0.5, velocity: 0.8 },
          { midi: 71, time: 2.5, duration: 0.5, velocity: 0.8 },
          { midi: 74, time: 3, duration: 0.5, velocity: 0.8 },
          { midi: 72, time: 3.5, duration: 0.5, velocity: 0.8 },
          { midi: 69, time: 4, duration: 1, velocity: 0.8 },
          { midi: 64, time: 5, duration: 0.5, velocity: 0.7 },
          { midi: 69, time: 5.5, duration: 0.5, velocity: 0.7 },
          { midi: 71, time: 6, duration: 1, velocity: 0.8 },
          { midi: 68, time: 7, duration: 0.5, velocity: 0.7 },
          { midi: 71, time: 7.5, duration: 0.5, velocity: 0.7 },
          { midi: 72, time: 8, duration: 1, velocity: 0.8 },
          { midi: 76, time: 9, duration: 0.5, velocity: 0.8 },
          { midi: 75, time: 9.5, duration: 0.5, velocity: 0.8 },
          { midi: 76, time: 10, duration: 0.5, velocity: 0.8 },
          { midi: 75, time: 10.5, duration: 0.5, velocity: 0.8 },
          { midi: 76, time: 11, duration: 0.5, velocity: 0.8 },
          { midi: 71, time: 11.5, duration: 0.5, velocity: 0.8 },
          { midi: 74, time: 12, duration: 0.5, velocity: 0.8 },
          { midi: 72, time: 12.5, duration: 0.5, velocity: 0.8 },
          { midi: 69, time: 13, duration: 1, velocity: 0.8 },
        ],
      },
      {
        instrument: "piano",
        name: "Piano (Main gauche)",
        muted: false,
        notes: [
          { midi: 45, time: 4, duration: 0.5, velocity: 0.5 },
          { midi: 52, time: 4.5, duration: 0.5, velocity: 0.5 },
          { midi: 57, time: 5, duration: 0.5, velocity: 0.5 },
          { midi: 40, time: 6, duration: 0.5, velocity: 0.5 },
          { midi: 52, time: 6.5, duration: 0.5, velocity: 0.5 },
          { midi: 56, time: 7, duration: 0.5, velocity: 0.5 },
          { midi: 45, time: 8, duration: 0.5, velocity: 0.5 },
          { midi: 52, time: 8.5, duration: 0.5, velocity: 0.5 },
          { midi: 57, time: 9, duration: 0.5, velocity: 0.5 },
          { midi: 45, time: 13, duration: 0.5, velocity: 0.5 },
          { midi: 52, time: 13.5, duration: 0.5, velocity: 0.5 },
          { midi: 57, time: 14, duration: 0.5, velocity: 0.5 },
        ],
      },
    ],
  },
  "ode-to-joy": {
    title: "Hymne à la Joie",
    composer: "Ludwig van Beethoven",
    bpm: 110,
    timeSignature: [4, 4],
    tracks: [
      {
        instrument: "piano",
        name: "Piano (Mélodie)",
        muted: false,
        notes: [
          { midi: 64, time: 0, duration: 1, velocity: 0.8 },
          { midi: 64, time: 1, duration: 1, velocity: 0.8 },
          { midi: 65, time: 2, duration: 1, velocity: 0.8 },
          { midi: 67, time: 3, duration: 1, velocity: 0.8 },
          { midi: 67, time: 4, duration: 1, velocity: 0.8 },
          { midi: 65, time: 5, duration: 1, velocity: 0.8 },
          { midi: 64, time: 6, duration: 1, velocity: 0.8 },
          { midi: 62, time: 7, duration: 1, velocity: 0.8 },
          { midi: 60, time: 8, duration: 1, velocity: 0.8 },
          { midi: 60, time: 9, duration: 1, velocity: 0.8 },
          { midi: 62, time: 10, duration: 1, velocity: 0.8 },
          { midi: 64, time: 11, duration: 1, velocity: 0.8 },
          { midi: 64, time: 12, duration: 1.5, velocity: 0.8 },
          { midi: 62, time: 13.5, duration: 0.5, velocity: 0.7 },
          { midi: 62, time: 14, duration: 2, velocity: 0.8 },
        ],
      },
      {
        instrument: "strings",
        name: "Cordes (Harmonie)",
        muted: false,
        notes: [
          { midi: 48, time: 0, duration: 2, velocity: 0.5 },
          { midi: 52, time: 0, duration: 2, velocity: 0.5 },
          { midi: 55, time: 0, duration: 2, velocity: 0.5 },
          { midi: 48, time: 2, duration: 2, velocity: 0.5 },
          { midi: 53, time: 2, duration: 2, velocity: 0.5 },
          { midi: 57, time: 2, duration: 2, velocity: 0.5 },
          { midi: 48, time: 4, duration: 2, velocity: 0.5 },
          { midi: 52, time: 4, duration: 2, velocity: 0.5 },
          { midi: 55, time: 4, duration: 2, velocity: 0.5 },
          { midi: 47, time: 6, duration: 2, velocity: 0.5 },
          { midi: 50, time: 6, duration: 2, velocity: 0.5 },
          { midi: 55, time: 6, duration: 2, velocity: 0.5 },
          { midi: 48, time: 8, duration: 2, velocity: 0.5 },
          { midi: 52, time: 8, duration: 2, velocity: 0.5 },
          { midi: 55, time: 8, duration: 2, velocity: 0.5 },
          { midi: 48, time: 10, duration: 2, velocity: 0.5 },
          { midi: 52, time: 10, duration: 2, velocity: 0.5 },
          { midi: 55, time: 10, duration: 2, velocity: 0.5 },
          { midi: 48, time: 12, duration: 4, velocity: 0.5 },
          { midi: 52, time: 12, duration: 4, velocity: 0.5 },
          { midi: 55, time: 12, duration: 4, velocity: 0.5 },
        ],
      },
      {
        instrument: "bass",
        name: "Basse",
        muted: false,
        notes: [
          { midi: 36, time: 0, duration: 2, velocity: 0.6 },
          { midi: 36, time: 2, duration: 2, velocity: 0.6 },
          { midi: 36, time: 4, duration: 2, velocity: 0.6 },
          { midi: 35, time: 6, duration: 2, velocity: 0.6 },
          { midi: 36, time: 8, duration: 2, velocity: 0.6 },
          { midi: 36, time: 10, duration: 2, velocity: 0.6 },
          { midi: 36, time: 12, duration: 4, velocity: 0.6 },
        ],
      },
    ],
  },
  "canon-in-d": {
    title: "Canon en Ré",
    composer: "Johann Pachelbel",
    bpm: 72,
    timeSignature: [4, 4],
    tracks: [
      {
        instrument: "piano",
        name: "Piano",
        muted: false,
        notes: [
          { midi: 74, time: 0, duration: 1, velocity: 0.7 },
          { midi: 73, time: 1, duration: 1, velocity: 0.7 },
          { midi: 71, time: 2, duration: 1, velocity: 0.7 },
          { midi: 69, time: 3, duration: 1, velocity: 0.7 },
          { midi: 67, time: 4, duration: 1, velocity: 0.7 },
          { midi: 66, time: 5, duration: 1, velocity: 0.7 },
          { midi: 67, time: 6, duration: 1, velocity: 0.7 },
          { midi: 69, time: 7, duration: 1, velocity: 0.7 },
          // Second phrase
          { midi: 74, time: 8, duration: 0.5, velocity: 0.7 },
          { midi: 76, time: 8.5, duration: 0.5, velocity: 0.7 },
          { midi: 73, time: 9, duration: 0.5, velocity: 0.7 },
          { midi: 74, time: 9.5, duration: 0.5, velocity: 0.7 },
          { midi: 71, time: 10, duration: 0.5, velocity: 0.7 },
          { midi: 73, time: 10.5, duration: 0.5, velocity: 0.7 },
          { midi: 69, time: 11, duration: 0.5, velocity: 0.7 },
          { midi: 71, time: 11.5, duration: 0.5, velocity: 0.7 },
          { midi: 67, time: 12, duration: 0.5, velocity: 0.7 },
          { midi: 69, time: 12.5, duration: 0.5, velocity: 0.7 },
          { midi: 66, time: 13, duration: 0.5, velocity: 0.7 },
          { midi: 67, time: 13.5, duration: 0.5, velocity: 0.7 },
          { midi: 67, time: 14, duration: 0.5, velocity: 0.7 },
          { midi: 69, time: 14.5, duration: 0.5, velocity: 0.7 },
          { midi: 69, time: 15, duration: 0.5, velocity: 0.7 },
          { midi: 71, time: 15.5, duration: 0.5, velocity: 0.7 },
        ],
      },
      {
        instrument: "strings",
        name: "Cordes",
        muted: false,
        notes: [
          { midi: 62, time: 0, duration: 2, velocity: 0.4 },
          { midi: 57, time: 2, duration: 2, velocity: 0.4 },
          { midi: 59, time: 4, duration: 2, velocity: 0.4 },
          { midi: 54, time: 6, duration: 2, velocity: 0.4 },
          { midi: 62, time: 8, duration: 2, velocity: 0.4 },
          { midi: 57, time: 10, duration: 2, velocity: 0.4 },
          { midi: 59, time: 12, duration: 2, velocity: 0.4 },
          { midi: 54, time: 14, duration: 2, velocity: 0.4 },
        ],
      },
      {
        instrument: "bass",
        name: "Basse",
        muted: false,
        notes: [
          { midi: 50, time: 0, duration: 2, velocity: 0.5 },
          { midi: 45, time: 2, duration: 2, velocity: 0.5 },
          { midi: 47, time: 4, duration: 2, velocity: 0.5 },
          { midi: 42, time: 6, duration: 2, velocity: 0.5 },
          { midi: 50, time: 8, duration: 2, velocity: 0.5 },
          { midi: 45, time: 10, duration: 2, velocity: 0.5 },
          { midi: 47, time: 12, duration: 2, velocity: 0.5 },
          { midi: 42, time: 14, duration: 2, velocity: 0.5 },
        ],
      },
    ],
  },
  "samai-bayati": {
    title: "Samai Bayati",
    composer: "Ibrahim al-Aryan",
    bpm: 90,
    timeSignature: [10, 8],
    tracks: [
      {
        instrument: "piano", // Oud simulation
        name: "Oud / Mélodie",
        muted: false,
        notes: [
          // Simplified 10/8 rhythm for demo purposes
          { midi: 62, time: 0, duration: 1, velocity: 0.8 }, // D
          { midi: 62, time: 1, duration: 1, velocity: 0.8 }, // D
          { midi: 63, time: 2, duration: 1, velocity: 0.8 }, // Eb (simplified half-flat)
          { midi: 65, time: 3, duration: 1, velocity: 0.8 }, // F
          { midi: 67, time: 4, duration: 2, velocity: 0.8 }, // G
          { midi: 65, time: 6, duration: 1, velocity: 0.8 }, // F
          { midi: 63, time: 7, duration: 1, velocity: 0.8 }, // Eb
          { midi: 62, time: 8, duration: 2, velocity: 0.8 }, // D
          // Phrase 2
          { midi: 69, time: 10, duration: 1, velocity: 0.8 }, // A
          { midi: 67, time: 11, duration: 1, velocity: 0.8 }, // G
          { midi: 65, time: 12, duration: 1, velocity: 0.8 }, // F
          { midi: 63, time: 13, duration: 1, velocity: 0.8 }, // Eb
          { midi: 62, time: 14, duration: 2, velocity: 0.8 }, // D
          { midi: 60, time: 16, duration: 1, velocity: 0.8 }, // C
          { midi: 58, time: 17, duration: 1, velocity: 0.8 }, // Bb
          { midi: 57, time: 18, duration: 2, velocity: 0.8 }, // A
        ],
      },
      {
        instrument: "drums",
        name: "Darbuka (Samai)",
        muted: false,
        notes: [
          // Samai thaqil pattern: Dum .. Tek .. Dum Dum Tek .. (10/8)
          { midi: 36, time: 0, duration: 1, velocity: 0.9 }, // Dum
          { midi: 38, time: 3, duration: 1, velocity: 0.7 }, // Tek
          { midi: 36, time: 6, duration: 1, velocity: 0.9 }, // Dum
          { midi: 36, time: 7, duration: 1, velocity: 0.9 }, // Dum
          { midi: 38, time: 8, duration: 1, velocity: 0.7 }, // Tek
          
          { midi: 36, time: 10, duration: 1, velocity: 0.9 }, // Dum
          { midi: 38, time: 13, duration: 1, velocity: 0.7 }, // Tek
          { midi: 36, time: 16, duration: 1, velocity: 0.9 }, // Dum
          { midi: 36, time: 17, duration: 1, velocity: 0.9 }, // Dum
          { midi: 38, time: 18, duration: 1, velocity: 0.7 }, // Tek
        ],
      },
    ],
  },
  "sidi-mansour": {
    title: "Sidi Mansour",
    composer: "Traditionnel Tunisien",
    bpm: 105,
    timeSignature: [4, 4],
    tracks: [
      {
        instrument: "piano", // Mezoued/Zokra simulation
        name: "Mélodie (Zokra)",
        muted: false,
        notes: [
          { midi: 69, time: 0, duration: 0.5, velocity: 0.9 }, // A
          { midi: 67, time: 0.5, duration: 0.5, velocity: 0.9 }, // G
          { midi: 69, time: 1, duration: 1, velocity: 0.9 },   // A
          { midi: 65, time: 2, duration: 0.5, velocity: 0.9 }, // F
          { midi: 67, time: 2.5, duration: 0.5, velocity: 0.9 }, // G
          { midi: 69, time: 3, duration: 1, velocity: 0.9 },   // A
          
          { midi: 69, time: 4, duration: 0.5, velocity: 0.9 }, // A
          { midi: 67, time: 4.5, duration: 0.5, velocity: 0.9 }, // G
          { midi: 69, time: 5, duration: 1, velocity: 0.9 },   // A
          { midi: 65, time: 6, duration: 0.5, velocity: 0.9 }, // F
          { midi: 67, time: 6.5, duration: 0.5, velocity: 0.9 }, // G
          { midi: 69, time: 7, duration: 1, velocity: 0.9 },   // A
          
          // Ya baba Sidi Mansour
          { midi: 72, time: 8, duration: 1, velocity: 0.9 },   // C
          { midi: 70, time: 9, duration: 1, velocity: 0.9 },   // Bb
          { midi: 69, time: 10, duration: 1, velocity: 0.9 },  // A
          { midi: 67, time: 11, duration: 1, velocity: 0.9 },  // G
          { midi: 65, time: 12, duration: 1, velocity: 0.9 },  // F
          { midi: 67, time: 13, duration: 1, velocity: 0.9 },  // G
          { midi: 69, time: 14, duration: 2, velocity: 0.9 },  // A
        ],
      },
      {
        instrument: "drums",
        name: "Percussions (Fazzani)",
        muted: false,
        notes: [
          // Fazzani pattern
          { midi: 36, time: 0, duration: 0.5, velocity: 0.9 }, // Dum
          { midi: 38, time: 1, duration: 0.5, velocity: 0.7 }, // Tek
          { midi: 36, time: 2, duration: 0.5, velocity: 0.9 }, // Dum
          { midi: 38, time: 2.5, duration: 0.5, velocity: 0.7 },// Tek
          { midi: 38, time: 3, duration: 0.5, velocity: 0.7 }, // Tek
          
          { midi: 36, time: 4, duration: 0.5, velocity: 0.9 },
          { midi: 38, time: 5, duration: 0.5, velocity: 0.7 },
          { midi: 36, time: 6, duration: 0.5, velocity: 0.9 },
          { midi: 38, time: 6.5, duration: 0.5, velocity: 0.7 },
          { midi: 38, time: 7, duration: 0.5, velocity: 0.7 },
          
          { midi: 36, time: 8, duration: 0.5, velocity: 0.9 },
          { midi: 38, time: 9, duration: 0.5, velocity: 0.7 },
          { midi: 36, time: 10, duration: 0.5, velocity: 0.9 },
          { midi: 38, time: 10.5, duration: 0.5, velocity: 0.7 },
          { midi: 38, time: 11, duration: 0.5, velocity: 0.7 },
          
          { midi: 36, time: 12, duration: 0.5, velocity: 0.9 },
          { midi: 38, time: 13, duration: 0.5, velocity: 0.7 },
          { midi: 36, time: 14, duration: 0.5, velocity: 0.9 },
          { midi: 38, time: 14.5, duration: 0.5, velocity: 0.7 },
          { midi: 38, time: 15, duration: 0.5, velocity: 0.7 },
        ]
      }
    ]
  }
};

// ===== COMPONENT =====
export function SheetMusicViewer() {
  const [selectedScore, setSelectedScore] = useState("ode-to-joy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [speed, setSpeed] = useState(100);
  const [tracks, setTracks] = useState<Track[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const scheduledRef = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);

  const score = DEMO_SCORES[selectedScore];
  const effectiveBpm = (score.bpm * speed) / 100;
  const beatDur = 60 / effectiveBpm;
  const totalBeats = useMemo(
    () => Math.max(...score.tracks.flatMap(t => t.notes.map(n => n.time + n.duration))) + 2,
    [score]
  );

  useEffect(() => {
    setTracks(score.tracks.map(t => ({ ...t })));
    setCurrentBeat(0);
    scheduledRef.current.clear();
  }, [score]);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  }, []);

  // ===== DRAW SHEET MUSIC =====
  const draw = useCallback((beat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    const DPR = 2;
    const W = canvas.width / DPR;
    const H = canvas.height / DPR;
    c.save();
    c.scale(DPR, DPR);

    // Clear
    c.fillStyle = "#fefce8"; // Warm parchment
    c.fillRect(0, 0, W, H);

    // Subtle paper texture
    c.fillStyle = "rgba(180, 150, 100, 0.03)";
    for (let i = 0; i < 50; i++) {
      c.fillRect(Math.random() * W, Math.random() * H, Math.random() * 3, Math.random() * 3);
    }

    const MARGIN_LEFT = 70;
    const LINE_SPACING = 8; // space between staff lines
    const STAFF_HEIGHT = LINE_SPACING * 4; // 5 lines = 4 spaces
    const PX_PER_BEAT = 60;
    const scrollX = Math.max(0, beat * PX_PER_BEAT - 200);

    const visibleTracks = tracks.filter(t => !t.muted);
    let yOffset = 40;

    for (let trackIdx = 0; trackIdx < visibleTracks.length; trackIdx++) {
      const track = visibleTracks[trackIdx];
      const info = INSTRUMENT_INFO[track.instrument];
      const clef = info.clef === "both" ? (trackIdx === 0 ? "treble" : "bass") : info.clef;
      const staffY = yOffset;

      // Track label
      c.fillStyle = info.color;
      c.font = "bold 10px 'Inter', sans-serif";
      c.textAlign = "left";
      c.fillText(`${info.icon} ${track.name}`, 4, staffY + STAFF_HEIGHT / 2 + 4);

      // Draw 5 staff lines
      for (let line = 0; line < 5; line++) {
        const ly = staffY + line * LINE_SPACING;
        c.strokeStyle = "#94867a";
        c.lineWidth = 0.8;
        c.beginPath();
        c.moveTo(MARGIN_LEFT, ly);
        c.lineTo(W, ly);
        c.stroke();
      }

      // Clef symbol
      c.fillStyle = "#2c1810";
      c.font = "bold 28px serif";
      c.textAlign = "center";
      if (clef === "treble") {
        c.fillText("𝄞", MARGIN_LEFT + 12, staffY + STAFF_HEIGHT - 2);
      } else if (clef === "bass") {
        c.fillText("𝄢", MARGIN_LEFT + 12, staffY + STAFF_HEIGHT - 6);
      } else {
        c.font = "bold 22px serif";
        c.fillText("𝄥", MARGIN_LEFT + 12, staffY + STAFF_HEIGHT / 2 + 6);
      }

      // Time signature
      c.fillStyle = "#2c1810";
      c.font = "bold 14px serif";
      c.textAlign = "center";
      c.fillText(String(score.timeSignature[0]), MARGIN_LEFT + 36, staffY + LINE_SPACING * 1.5);
      c.fillText(String(score.timeSignature[1]), MARGIN_LEFT + 36, staffY + LINE_SPACING * 3.5);

      // Bar lines
      const beatsPerBar = score.timeSignature[0];
      for (let bar = 0; bar * beatsPerBar < totalBeats + beatsPerBar; bar++) {
        const bx = MARGIN_LEFT + 50 + bar * beatsPerBar * PX_PER_BEAT - scrollX;
        if (bx < MARGIN_LEFT || bx > W) continue;
        c.strokeStyle = "#94867a";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(bx, staffY);
        c.lineTo(bx, staffY + STAFF_HEIGHT);
        c.stroke();

        // Bar number
        c.fillStyle = "#94867a";
        c.font = "9px sans-serif";
        c.textAlign = "center";
        c.fillText(String(bar + 1), bx, staffY - 4);
      }

      // Draw notes
      for (const note of track.notes) {
        const nx = MARGIN_LEFT + 50 + note.time * PX_PER_BEAT - scrollX;
        if (nx < MARGIN_LEFT - 20 || nx > W + 20) continue;

        const staffPos = clef === "percussion"
          ? 2 // middle of staff for percussion
          : midiToStaffPos(note.midi, clef === "treble" ? "treble" : "bass");

        // Map staff position to Y coordinate
        // staffPos 0 = C4 for treble, which is one ledger line below
        // Treble staff: bottom line = E4 (pos 2), top line = F5 (pos 9)
        // Bass staff: bottom line = G2, top line = A3
        let ny: number;
        if (clef === "treble") {
          ny = staffY + STAFF_HEIGHT - (staffPos - 2) * (LINE_SPACING / 2);
        } else if (clef === "bass") {
          ny = staffY + STAFF_HEIGHT - (staffPos - 14) * (LINE_SPACING / 2);
        } else {
          ny = staffY + LINE_SPACING * 2;
        }

        // Clamp Y to reasonable range
        ny = Math.max(staffY - LINE_SPACING * 3, Math.min(staffY + STAFF_HEIGHT + LINE_SPACING * 3, ny));

        // Active highlight
        const isActive = note.time <= beat && note.time + note.duration > beat;
        const isPast = note.time + note.duration <= beat;
        const isFuture = note.time > beat;

        // Ledger lines
        if (ny > staffY + STAFF_HEIGHT) {
          for (let ly = staffY + STAFF_HEIGHT + LINE_SPACING; ly <= ny + 1; ly += LINE_SPACING) {
            c.strokeStyle = "#94867a";
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(nx - 8, ly);
            c.lineTo(nx + 8, ly);
            c.stroke();
          }
        }
        if (ny < staffY) {
          for (let ly = staffY - LINE_SPACING; ly >= ny - 1; ly -= LINE_SPACING) {
            c.strokeStyle = "#94867a";
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(nx - 8, ly);
            c.lineTo(nx + 8, ly);
            c.stroke();
          }
        }

        // Note head (filled oval)
        const isHalf = note.duration >= 2;
        c.save();
        c.translate(nx, ny);
        c.rotate(-0.15);
        c.beginPath();
        c.ellipse(0, 0, 5.5, 4, 0, 0, Math.PI * 2);

        if (isActive) {
          c.fillStyle = info.color;
          c.shadowColor = info.color;
          c.shadowBlur = 12;
        } else if (isPast) {
          c.fillStyle = "rgba(100, 80, 60, 0.3)";
        } else {
          c.fillStyle = "#2c1810";
        }

        if (isHalf) {
          c.strokeStyle = c.fillStyle as string;
          c.lineWidth = 1.5;
          c.stroke();
        } else {
          c.fill();
        }
        c.shadowBlur = 0;
        c.restore();

        // Stem
        const stemUp = ny > staffY + STAFF_HEIGHT / 2;
        const stemX = stemUp ? nx + 5 : nx - 5;
        const stemLen = LINE_SPACING * 3.5;
        c.strokeStyle = isActive ? info.color : isPast ? "rgba(100,80,60,0.3)" : "#2c1810";
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(stemX, ny);
        c.lineTo(stemX, stemUp ? ny - stemLen : ny + stemLen);
        c.stroke();

        // Flag for eighth notes
        if (note.duration <= 0.5) {
          const flagDir = stemUp ? -1 : 1;
          const flagY = stemUp ? ny - stemLen : ny + stemLen;
          c.strokeStyle = isActive ? info.color : isPast ? "rgba(100,80,60,0.3)" : "#2c1810";
          c.lineWidth = 1.2;
          c.beginPath();
          c.moveTo(stemX, flagY);
          c.quadraticCurveTo(stemX + 8, flagY + flagDir * 8, stemX + 2, flagY + flagDir * 16);
          c.stroke();
        }

        // Sharp symbol
        if (isSharp(note.midi)) {
          c.fillStyle = isActive ? info.color : "#2c1810";
          c.font = "bold 12px serif";
          c.textAlign = "center";
          c.fillText("♯", nx - 12, ny + 4);
        }

        // Note name tooltip on active
        if (isActive) {
          const noteName = midiToNoteName(note.midi);
          const nameFr = NOTE_NAMES_FR[noteName.replace("#", "")] || noteName;
          c.fillStyle = info.color;
          c.font = "bold 9px sans-serif";
          c.textAlign = "center";
          c.fillText(`${nameFr}${midiToOctave(note.midi)}`, nx, ny - 14);
        }
      }

      yOffset += STAFF_HEIGHT + 50;
    }

    // Playhead
    const phX = MARGIN_LEFT + 50 + beat * PX_PER_BEAT - scrollX;
    if (phX >= MARGIN_LEFT && phX <= W) {
      c.strokeStyle = "#EF4444";
      c.lineWidth = 2;
      c.setLineDash([4, 4]);
      c.beginPath();
      c.moveTo(phX, 20);
      c.lineTo(phX, yOffset - 30);
      c.stroke();
      c.setLineDash([]);

      // Playhead triangle
      c.fillStyle = "#EF4444";
      c.beginPath();
      c.moveTo(phX - 5, 16);
      c.lineTo(phX + 5, 16);
      c.lineTo(phX, 22);
      c.closePath();
      c.fill();
    }

    // Title
    c.fillStyle = "#2c1810";
    c.font = "bold 13px 'Outfit', serif";
    c.textAlign = "center";
    c.fillText(score.title, W / 2, 14);

    c.restore();
  }, [tracks, score, totalBeats]);

  // Animation loop
  const tick = useCallback(() => {
    if (!isPlaying) return;
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const beat = elapsed / beatDur;
    setCurrentBeat(beat);

    // Schedule sounds
    for (let ti = 0; ti < tracks.length; ti++) {
      if (tracks[ti].muted) continue;
      for (let ni = 0; ni < tracks[ti].notes.length; ni++) {
        const key = `${ti}-${ni}`;
        const note = tracks[ti].notes[ni];
        if (!scheduledRef.current.has(key) && note.time <= beat && note.time + 0.05 > beat) {
          scheduledRef.current.add(key);
          playInstrumentNote(
            getCtx(),
            tracks[ti].instrument,
            note.midi,
            note.velocity,
            note.duration * beatDur,
            volume
          );
        }
      }
    }

    draw(beat);

    if (beat > totalBeats) {
      setIsPlaying(false);
      return;
    }
    animRef.current = requestAnimationFrame(tick);
  }, [isPlaying, beatDur, tracks, totalBeats, volume, getCtx, draw]);

  useEffect(() => {
    if (isPlaying) animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, tick]);

  useEffect(() => { draw(0); }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      draw(currentBeat);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      getCtx();
      startTimeRef.current = performance.now() - currentBeat * beatDur * 1000;
      scheduledRef.current.clear();
      for (let ti = 0; ti < tracks.length; ti++) {
        for (let ni = 0; ni < tracks[ti].notes.length; ni++) {
          if (tracks[ti].notes[ni].time < currentBeat) scheduledRef.current.add(`${ti}-${ni}`);
        }
      }
      setIsPlaying(true);
    }
  };

  const restart = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    scheduledRef.current.clear();
    draw(0);
  };

  const toggleTrackMute = (idx: number) => {
    setTracks(prev => prev.map((t, i) => i === idx ? { ...t, muted: !t.muted } : t));
  };

  const changeScore = (key: string) => {
    setIsPlaying(false);
    setSelectedScore(key);
    setCurrentBeat(0);
    scheduledRef.current.clear();
  };

  const formatTime = (beats: number) => {
    const secs = beats * beatDur;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {/* Score selector */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedScore} onValueChange={(val) => val && changeScore(val)}>
          <SelectTrigger className="w-[280px] bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DEMO_SCORES).map(([key, s]) => (
              <SelectItem key={key} value={key}>
                {s.title} — {s.composer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Tempo</span>
          <Select value={String(speed)} onValueChange={(v) => v && setSpeed(Number(v))}>
            <SelectTrigger className="w-[80px] bg-white/5 border-white/10 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground font-mono">{effectiveBpm.toFixed(0)} BPM</span>
        </div>
      </div>

      {/* Sheet music canvas */}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
        <canvas
          ref={canvasRef}
          className="w-full cursor-default"
          style={{
            height: `${Math.max(200, tracks.filter(t => !t.muted).length * 82 + 60)}px`,
          }}
        />
      </div>

      {/* Track mixer */}
      <div className="flex flex-wrap gap-2">
        {tracks.map((track, i) => {
          const info = INSTRUMENT_INFO[track.instrument];
          return (
            <button
              key={i}
              onClick={() => toggleTrackMute(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                track.muted
                  ? "bg-white/3 border-white/5 text-muted-foreground opacity-50"
                  : "border-white/10 text-white"
              }`}
              style={{
                backgroundColor: track.muted ? undefined : `${info.color}15`,
                borderColor: track.muted ? undefined : `${info.color}30`,
              }}
            >
              {track.muted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{info.icon} {track.name}</span>
            </button>
          );
        })}
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <Button onClick={restart} variant="ghost" size="sm" className="h-9 w-9 p-0">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button onClick={togglePlay} size="sm" className="h-9 px-5 gradient-bg">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <span className="text-xs font-mono text-muted-foreground w-10">{formatTime(currentBeat)}</span>
          <Slider
            value={[currentBeat]}
            max={totalBeats}
            step={0.1}
            onValueChange={(val: any) => {
              const value = Array.isArray(val) ? val[0] : val;
              setCurrentBeat(value);
              startTimeRef.current = performance.now() - value * beatDur * 1000;
              draw(value);
            }}
            className="cursor-pointer"
          />
          <span className="text-xs font-mono text-muted-foreground w-10">{formatTime(totalBeats)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={(val: any) => setVolume((Array.isArray(val) ? val[0] : val) / 100)}
            max={100}
            className="w-20"
          />
        </div>
      </div>

      {/* Track info */}
      <div className="text-xs text-center text-muted-foreground">
        {score.title} — {score.composer} •{" "}
        {tracks.length} piste{tracks.length > 1 ? "s" : ""} •{" "}
        Cliquez sur une piste pour la muter/démuter
      </div>
    </div>
  );
}
