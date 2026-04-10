"use client";

import { useState, useCallback, useRef } from "react";
import { Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SCALE_PATTERNS: Record<string, { name: string; intervals: number[]; category: string }> = {
  major: { name: "Majeure", intervals: [0, 2, 4, 5, 7, 9, 11, 12], category: "Fondamentales" },
  minor: { name: "Mineure naturelle", intervals: [0, 2, 3, 5, 7, 8, 10, 12], category: "Fondamentales" },
  harmonic_minor: { name: "Mineure harmonique", intervals: [0, 2, 3, 5, 7, 8, 11, 12], category: "Fondamentales" },
  melodic_minor: { name: "Mineure mélodique", intervals: [0, 2, 3, 5, 7, 9, 11, 12], category: "Fondamentales" },
  pentatonic_major: { name: "Pentatonique majeure", intervals: [0, 2, 4, 7, 9, 12], category: "Pentatoniques" },
  pentatonic_minor: { name: "Pentatonique mineure", intervals: [0, 3, 5, 7, 10, 12], category: "Pentatoniques" },
  blues: { name: "Blues", intervals: [0, 3, 5, 6, 7, 10, 12], category: "Blues/Jazz" },
  dorian: { name: "Dorien", intervals: [0, 2, 3, 5, 7, 9, 10, 12], category: "Modes" },
  mixolydian: { name: "Mixolydien", intervals: [0, 2, 4, 5, 7, 9, 10, 12], category: "Modes" },
  phrygian: { name: "Phrygien", intervals: [0, 1, 3, 5, 7, 8, 10, 12], category: "Modes" },
  lydian: { name: "Lydien", intervals: [0, 2, 4, 6, 7, 9, 11, 12], category: "Modes" },
  locrian: { name: "Locrien", intervals: [0, 1, 3, 5, 6, 8, 10, 12], category: "Modes" },
  chromatic: { name: "Chromatique", intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], category: "Autre" },
  whole_tone: { name: "Tons entiers", intervals: [0, 2, 4, 6, 8, 10, 12], category: "Autre" },
};

const NOTE_NAMES_FR: Record<string, string> = {
  "C": "Do", "C#": "Do#", "D": "Ré", "D#": "Ré#", "E": "Mi",
  "F": "Fa", "F#": "Fa#", "G": "Sol", "G#": "Sol#", "A": "La",
  "A#": "La#", "B": "Si",
};

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function ScalesReference() {
  const [rootNote, setRootNote] = useState("C");
  const [scaleKey, setScaleKey] = useState("major");
  const [volume, setVolume] = useState(0.5);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scale = SCALE_PATTERNS[scaleKey];
  const rootMidi = 60 + ROOT_NOTES.indexOf(rootNote); // C4 = 60

  const scaleNotes = scale.intervals.map((interval, i) => {
    const midi = rootMidi + interval;
    const noteName = ROOT_NOTES[midi % 12];
    return {
      midi,
      name: noteName,
      nameFr: NOTE_NAMES_FR[noteName],
      interval,
      degree: i + 1,
    };
  });

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((midi: number, index: number) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(midiToFreq(midi), ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);

    setPlayingIndex(index);
    setTimeout(() => setPlayingIndex(null), 400);
  }, [getAudioContext, volume]);

  const playScale = useCallback(() => {
    const delay = 0.35;
    scaleNotes.forEach((note, i) => {
      setTimeout(() => playNote(note.midi, i), i * delay * 1000);
    });
  }, [scaleNotes, playNote]);

  // Piano visualization (2 octaves)
  const pianoKeys = [];
  for (let m = rootMidi - 2; m <= rootMidi + 14; m++) {
    const noteName = ROOT_NOTES[m % 12];
    const isInScale = scale.intervals.includes(m - rootMidi);
    const isRoot = m === rootMidi || m === rootMidi + 12;
    const isBlack = noteName.includes("#");
    pianoKeys.push({ midi: m, name: noteName, isBlack, isInScale, isRoot });
  }

  const whiteKeys = pianoKeys.filter(k => !k.isBlack);
  const allKeys = pianoKeys;

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tonique :</span>
          <Select value={rootNote} onValueChange={(val) => val && setRootNote(val)}>
            <SelectTrigger className="w-24 bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOT_NOTES.map((note) => (
                <SelectItem key={note} value={note}>
                  {NOTE_NAMES_FR[note]} ({note})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Gamme :</span>
          <Select value={scaleKey} onValueChange={(val) => val && setScaleKey(val)}>
            <SelectTrigger className="w-52 bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SCALE_PATTERNS).map(([key, s]) => (
                <SelectItem key={key} value={key}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={playScale} className="gap-2 gradient-bg">
          <Play className="w-4 h-4" /> Écouter
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={(val: number[]) => setVolume(val[0] / 100)}
            max={100}
            className="w-24"
          />
        </div>
      </div>

      {/* Scale Info */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-1">
          {NOTE_NAMES_FR[rootNote]} {scale.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Catégorie : {scale.category} • {scaleNotes.length} notes
        </p>

        {/* Notes display */}
        <div className="flex flex-wrap gap-2">
          {scaleNotes.map((note, i) => (
            <button
              key={i}
              onClick={() => playNote(note.midi, i)}
              className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border-2 transition-all duration-200 ${
                playingIndex === i
                  ? "bg-purple-500/30 border-purple-500 scale-110 shadow-lg shadow-purple-500/20"
                  : note.degree === 1 || note.degree === scaleNotes.length
                    ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <span className="text-sm font-bold text-white">{note.nameFr}</span>
              <span className="text-[10px] text-muted-foreground">{note.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Piano Visualization */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Visualisation sur le clavier</h4>
        <div className="relative overflow-x-auto pb-2">
          <div className="relative flex" style={{ width: `${whiteKeys.length * 44}px`, minWidth: "100%" }}>
            {/* White keys */}
            {whiteKeys.map((key, i) => (
              <button
                key={key.midi}
                onClick={() => {
                  const idx = scaleNotes.findIndex(n => n.midi === key.midi);
                  if (idx >= 0) playNote(key.midi, idx);
                }}
                className={`w-11 h-32 border rounded-b-lg transition-all duration-150 flex flex-col items-center justify-end pb-2 ${
                  key.isRoot
                    ? "bg-gradient-to-b from-purple-300 to-purple-500 border-purple-400 shadow-md"
                    : key.isInScale
                      ? "bg-gradient-to-b from-cyan-200 to-cyan-400 border-cyan-300"
                      : "bg-gradient-to-b from-white to-gray-100 border-gray-300"
                }`}
              >
                {key.isInScale && (
                  <span className={`text-[9px] font-bold ${key.isRoot ? "text-white" : "text-cyan-800"}`}>
                    {NOTE_NAMES_FR[key.name]}
                  </span>
                )}
              </button>
            ))}

            {/* Black keys */}
            {allKeys.map((key, i) => {
              if (!key.isBlack) return null;
              const whiteIndex = allKeys.slice(0, i).filter(k => !k.isBlack).length;
              const left = whiteIndex * 44 - 14;

              return (
                <button
                  key={key.midi}
                  onClick={() => {
                    const idx = scaleNotes.findIndex(n => n.midi === key.midi);
                    if (idx >= 0) playNote(key.midi, idx);
                  }}
                  className={`absolute top-0 w-7 h-20 rounded-b-lg z-10 transition-all duration-150 flex items-end justify-center pb-1 ${
                    key.isRoot
                      ? "bg-gradient-to-b from-purple-600 to-purple-800 shadow-md"
                      : key.isInScale
                        ? "bg-gradient-to-b from-cyan-500 to-cyan-700"
                        : "bg-gradient-to-b from-gray-700 to-gray-900"
                  }`}
                  style={{ left: `${left}px` }}
                >
                  {key.isInScale && (
                    <span className="text-[8px] text-white/80 font-medium">{key.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Intervals */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Intervalles</h4>
        <div className="flex flex-wrap gap-1">
          {scale.intervals.slice(0, -1).map((interval, i) => {
            const step = scale.intervals[i + 1] - interval;
            return (
              <div key={i} className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded bg-white/5 text-white font-mono">
                  {step === 1 ? "½" : step === 2 ? "1" : step === 3 ? "1½" : `${step / 2}`}
                </span>
                {i < scale.intervals.length - 2 && (
                  <span className="text-muted-foreground text-xs">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
