"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FR = ["Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

const TUNINGS: Record<string, { name: string; notes: string[] }> = {
  guitar: { name: "Guitare Standard", notes: ["E2", "A2", "D3", "G3", "B3", "E4"] },
  bass: { name: "Basse Standard", notes: ["E1", "A1", "D2", "G2"] },
  ukulele: { name: "Ukulele Standard", notes: ["G4", "C4", "E4", "A4"] },
  violin: { name: "Violon Standard", notes: ["G3", "D4", "A4", "E5"] },
  chromatic: { name: "Chromatique", notes: [] },
};

function frequencyToNoteInfo(freq: number) {
  const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
  const noteIndex = Math.round(noteNum) + 69;
  const octave = Math.floor(noteIndex / 12) - 1;
  const noteName = NOTE_NAMES[noteIndex % 12];
  const noteNameFr = NOTE_NAMES_FR[noteIndex % 12];
  const cents = Math.round((noteNum - Math.round(noteNum)) * 100);
  return { noteName, noteNameFr, octave, cents, noteIndex: noteIndex % 12 };
}

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) {
    rms += buf[i] * buf[i];
  }
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = size - 1;
  const thresh = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < thresh) { r1 = i; break; }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < thresh) { r2 = size - i; break; }
  }

  buf = buf.slice(r1, r2);
  size = buf.length;

  const c = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export function Tuner({ className }: { className?: string }) {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [currentNoteFr, setCurrentNoteFr] = useState<string | null>(null);
  const [currentOctave, setCurrentOctave] = useState<number | null>(null);
  const [cents, setCents] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [tuning, setTuning] = useState("chromatic");

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buf = new Float32Array(analyser.fftSize);

      const detect = () => {
        analyser.getFloatTimeDomainData(buf);
        const freq = autoCorrelate(buf, audioContext.sampleRate);

        if (freq > 0 && freq < 5000) {
          const info = frequencyToNoteInfo(freq);
          setCurrentNote(info.noteName);
          setCurrentNoteFr(info.noteNameFr);
          setCurrentOctave(info.octave);
          setCents(info.cents);
          setFrequency(Math.round(freq * 10) / 10);
        }

        rafRef.current = requestAnimationFrame(detect);
      };

      detect();
      setIsListening(true);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
    setCurrentNote(null);
    setCurrentNoteFr(null);
    setCurrentOctave(null);
    setCents(0);
    setFrequency(0);
  }, []);

  useEffect(() => {
    return () => { stopListening(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inTune = Math.abs(cents) < 5;
  const closeToTune = Math.abs(cents) < 15;

  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold font-heading text-white mb-1">Accordeur</h2>
        <p className="text-sm text-muted-foreground">Accordez votre instrument avec précision</p>
      </div>

      {/* Tuning Selector */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-sm text-muted-foreground">Accordage :</span>
        <Select value={tuning} onValueChange={(val) => setTuning(val || "standard")}>
          <SelectTrigger className="w-48 h-9 bg-white/5 border-white/10 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TUNINGS).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Note Display */}
      <div className="text-center mb-6">
        {currentNote ? (
          <>
            <div
              className={`text-7xl sm:text-8xl font-bold font-heading mb-1 transition-colors duration-200 ${
                inTune ? "text-emerald-400" : closeToTune ? "text-amber-400" : "text-white"
              }`}
            >
              {currentNoteFr}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentNote}{currentOctave} — {frequency} Hz
            </div>
          </>
        ) : (
          <>
            <div className="text-7xl sm:text-8xl font-bold font-heading text-white/20 mb-1">—</div>
            <div className="text-sm text-muted-foreground">
              {isListening ? "Jouez une note..." : "Appuyez sur le micro pour commencer"}
            </div>
          </>
        )}
      </div>

      {/* Cents Indicator */}
      <div className="mb-8 px-4">
        <div className="relative h-8 flex items-center">
          {/* Background ticks */}
          <div className="absolute inset-x-0 flex items-center justify-between px-2">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className={`w-px ${i === 5 ? "h-6 bg-emerald-400/50" : "h-3 bg-white/10"}`}
              />
            ))}
          </div>
          {/* Needle */}
          {currentNote && (
            <div
              className="absolute top-0 -translate-x-1/2 transition-all duration-150"
              style={{ left: `${50 + cents}%` }}
            >
              <div
                className={`w-1 h-8 rounded-full ${
                  inTune ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : closeToTune ? "bg-amber-400 shadow-lg shadow-amber-400/50" : "bg-red-400 shadow-lg shadow-red-400/50"
                }`}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground px-1">
          <span>-50¢</span>
          <span className={`font-medium ${inTune ? "text-emerald-400" : ""}`}>
            {currentNote ? (inTune ? "✓ Accordé" : `${cents > 0 ? "+" : ""}${cents}¢`) : "0¢"}
          </span>
          <span>+50¢</span>
        </div>
      </div>

      {/* Reference Notes for selected tuning */}
      {tuning !== "chromatic" && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {TUNINGS[tuning].notes.map((note, i) => {
            const isActive = currentNote && note.startsWith(currentNote);
            return (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive
                    ? inTune
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-white/5 text-muted-foreground border border-transparent"
                }`}
              >
                {note}
              </div>
            );
          })}
        </div>
      )}

      {/* Mic Button */}
      <div className="flex items-center justify-center gap-3">
        <Button
          size="lg"
          className={`rounded-full w-16 h-16 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "gradient-bg hover:opacity-90"
          } text-white border-0 shadow-xl`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
        {isListening && (
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full border-white/10 text-muted-foreground hover:text-white"
            onClick={() => { setCents(0); setCurrentNote(null); setFrequency(0); }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
