"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type Note = {
  note: string;
  freq: number;
  key: string; // keyboard shortcut
  isBlack: boolean;
  octave: number;
};

const NOTES: Note[] = [
  // Octave 4
  { note: "C4", freq: 261.63, key: "a", isBlack: false, octave: 4 },
  { note: "C#4", freq: 277.18, key: "w", isBlack: true, octave: 4 },
  { note: "D4", freq: 293.66, key: "s", isBlack: false, octave: 4 },
  { note: "D#4", freq: 311.13, key: "e", isBlack: true, octave: 4 },
  { note: "E4", freq: 329.63, key: "d", isBlack: false, octave: 4 },
  { note: "F4", freq: 349.23, key: "f", isBlack: false, octave: 4 },
  { note: "F#4", freq: 369.99, key: "t", isBlack: true, octave: 4 },
  { note: "G4", freq: 392.0, key: "g", isBlack: false, octave: 4 },
  { note: "G#4", freq: 415.3, key: "y", isBlack: true, octave: 4 },
  { note: "A4", freq: 440.0, key: "h", isBlack: false, octave: 4 },
  { note: "A#4", freq: 466.16, key: "u", isBlack: true, octave: 4 },
  { note: "B4", freq: 493.88, key: "j", isBlack: false, octave: 4 },
  // Octave 5
  { note: "C5", freq: 523.25, key: "k", isBlack: false, octave: 5 },
  { note: "C#5", freq: 554.37, key: "o", isBlack: true, octave: 5 },
  { note: "D5", freq: 587.33, key: "l", isBlack: false, octave: 5 },
  { note: "D#5", freq: 622.25, key: "p", isBlack: true, octave: 5 },
  { note: "E5", freq: 659.25, key: ";", isBlack: false, octave: 5 },
];

const NOTE_NAMES: Record<string, string> = {
  "C": "Do", "C#": "Do#", "D": "Ré", "D#": "Ré#",
  "E": "Mi", "F": "Fa", "F#": "Fa#", "G": "Sol",
  "G#": "Sol#", "A": "La", "A#": "La#", "B": "Si",
};

export function VirtualPiano() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [sustain, setSustain] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeOscillators = useRef<Map<string, OscillatorNode>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }
    return { ctx: audioContextRef.current, gain: gainNodeRef.current! };
  }, [volume]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  const playNote = useCallback((note: Note) => {
    const { ctx, gain } = getAudioContext();
    if (activeOscillators.current.has(note.note)) return;

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

    // ADSR envelope
    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.1);

    osc.connect(noteGain);
    noteGain.connect(gain);
    osc.start();

    activeOscillators.current.set(note.note, osc);
    setActiveNotes((prev) => new Set([...prev, note.note]));

    const noteName = note.note.replace(/[0-9]/g, "");
    setLastNote(`${NOTE_NAMES[noteName] || noteName}${note.octave}`);
  }, [getAudioContext]);

  const stopNote = useCallback((note: Note) => {
    if (sustain) return;
    const osc = activeOscillators.current.get(note.note);
    if (osc) {
      try { osc.stop(audioContextRef.current!.currentTime + 0.1); } catch {}
      activeOscillators.current.delete(note.note);
    }
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(note.note);
      return next;
    });
  }, [sustain]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === " ") { setSustain(true); return; }
      const note = NOTES.find((n) => n.key === e.key.toLowerCase());
      if (note) playNote(note);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setSustain(false);
        // Release all notes
        activeOscillators.current.forEach((osc, key) => {
          try { osc.stop(audioContextRef.current!.currentTime + 0.1); } catch {}
        });
        activeOscillators.current.clear();
        setActiveNotes(new Set());
        return;
      }
      const note = NOTES.find((n) => n.key === e.key.toLowerCase());
      if (note) stopNote(note);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playNote, stopNote]);

  const whiteNotes = NOTES.filter((n) => !n.isBlack);
  const blackNotes = NOTES.filter((n) => n.isBlack);

  return (
    <div className="space-y-6">
      {/* Display */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-4xl font-bold font-heading text-white">
            {lastNote || "—"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Utilisez votre clavier (A-J, W-U) ou cliquez sur les touches • Espace = Sustain
        </p>
      </div>

      {/* Piano Keyboard */}
      <div className="relative mx-auto overflow-x-auto pb-4">
        <div className="relative flex mx-auto" style={{ width: `${whiteNotes.length * 56}px` }}>
          {/* White keys */}
          {whiteNotes.map((note, i) => (
            <button
              key={note.note}
              onMouseDown={() => playNote(note)}
              onMouseUp={() => stopNote(note)}
              onMouseLeave={() => stopNote(note)}
              className={`relative w-14 h-44 border border-white/20 rounded-b-lg transition-all duration-75 flex flex-col items-center justify-end pb-3 ${
                activeNotes.has(note.note)
                  ? "bg-gradient-to-b from-purple-400 to-purple-600 shadow-lg shadow-purple-500/30 scale-[0.98]"
                  : "bg-gradient-to-b from-white to-gray-100 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <span className={`text-[10px] font-bold ${activeNotes.has(note.note) ? "text-white" : "text-gray-500"}`}>
                {NOTE_NAMES[note.note.replace(/[0-9]/g, "")]}
              </span>
              <span className={`text-[9px] mt-0.5 ${activeNotes.has(note.note) ? "text-white/70" : "text-gray-400"}`}>
                {note.key.toUpperCase()}
              </span>
            </button>
          ))}

          {/* Black keys (positioned absolutely) */}
          {NOTES.map((note, i) => {
            if (!note.isBlack) return null;
            // Calculate position based on preceding white keys
            const whiteIndex = NOTES.slice(0, i).filter(n => !n.isBlack).length;
            const left = whiteIndex * 56 - 18;

            return (
              <button
                key={note.note}
                onMouseDown={() => playNote(note)}
                onMouseUp={() => stopNote(note)}
                onMouseLeave={() => stopNote(note)}
                className={`absolute top-0 w-9 h-28 rounded-b-lg z-10 transition-all duration-75 flex flex-col items-center justify-end pb-2 ${
                  activeNotes.has(note.note)
                    ? "bg-gradient-to-b from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30 scale-[0.98]"
                    : "bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800"
                }`}
                style={{ left: `${left}px` }}
              >
                <span className="text-[8px] text-white/60 font-medium">{note.key.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-3">
          {volume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-muted-foreground" />}
          <Slider
            value={[volume * 100]}
            onValueChange={(val: number[]) => setVolume(val[0] / 100)}
            max={100}
            step={1}
            className="w-32"
          />
          <span className="text-xs text-muted-foreground w-8">{Math.round(volume * 100)}%</span>
        </div>
        <button
          onClick={() => setSustain(!sustain)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            sustain
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
          }`}
        >
          Sustain {sustain ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}
