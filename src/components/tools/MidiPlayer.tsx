"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Play, Square, Pause, SkipBack, Volume2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Simple MIDI note data structure (works without external library too)
export type MidiNote = {
  name: string;
  midi: number;
  time: number;      // start time in seconds
  duration: number;  // duration in seconds
  velocity: number;  // 0-1
};

type MidiPlayerProps = {
  notes: MidiNote[];
  title?: string;
  bpm?: number;
  totalDuration?: number;
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function midiToNoteName(midi: number): string {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Pre-built demo songs
export const DEMO_SONGS: Record<string, { title: string; notes: MidiNote[]; bpm: number }> = {
  "fur-elise": {
    title: "Für Elise - Beethoven",
    bpm: 120,
    notes: [
      { name: "E5", midi: 76, time: 0, duration: 0.25, velocity: 0.8 },
      { name: "D#5", midi: 75, time: 0.25, duration: 0.25, velocity: 0.8 },
      { name: "E5", midi: 76, time: 0.5, duration: 0.25, velocity: 0.8 },
      { name: "D#5", midi: 75, time: 0.75, duration: 0.25, velocity: 0.8 },
      { name: "E5", midi: 76, time: 1.0, duration: 0.25, velocity: 0.8 },
      { name: "B4", midi: 71, time: 1.25, duration: 0.25, velocity: 0.8 },
      { name: "D5", midi: 74, time: 1.5, duration: 0.25, velocity: 0.8 },
      { name: "C5", midi: 72, time: 1.75, duration: 0.25, velocity: 0.8 },
      { name: "A4", midi: 69, time: 2.0, duration: 0.5, velocity: 0.8 },
      { name: "C4", midi: 60, time: 2.0, duration: 0.5, velocity: 0.5 },
      { name: "E4", midi: 64, time: 2.5, duration: 0.25, velocity: 0.7 },
      { name: "A4", midi: 69, time: 2.75, duration: 0.25, velocity: 0.7 },
      { name: "B4", midi: 71, time: 3.0, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 3.0, duration: 0.5, velocity: 0.5 },
      { name: "G#4", midi: 68, time: 3.5, duration: 0.25, velocity: 0.7 },
      { name: "B4", midi: 71, time: 3.75, duration: 0.25, velocity: 0.7 },
      { name: "C5", midi: 72, time: 4.0, duration: 0.5, velocity: 0.8 },
      { name: "E5", midi: 76, time: 4.5, duration: 0.25, velocity: 0.8 },
      { name: "D#5", midi: 75, time: 4.75, duration: 0.25, velocity: 0.8 },
      { name: "E5", midi: 76, time: 5.0, duration: 0.25, velocity: 0.8 },
      { name: "D#5", midi: 75, time: 5.25, duration: 0.25, velocity: 0.8 },
      { name: "E5", midi: 76, time: 5.5, duration: 0.25, velocity: 0.8 },
      { name: "B4", midi: 71, time: 5.75, duration: 0.25, velocity: 0.8 },
      { name: "D5", midi: 74, time: 6.0, duration: 0.25, velocity: 0.8 },
      { name: "C5", midi: 72, time: 6.25, duration: 0.25, velocity: 0.8 },
      { name: "A4", midi: 69, time: 6.5, duration: 0.5, velocity: 0.8 },
    ],
  },
  "twinkle": {
    title: "Ah! Vous dirai-je Maman (Twinkle Twinkle)",
    bpm: 100,
    notes: [
      { name: "C4", midi: 60, time: 0, duration: 0.5, velocity: 0.8 },
      { name: "C4", midi: 60, time: 0.5, duration: 0.5, velocity: 0.8 },
      { name: "G4", midi: 67, time: 1, duration: 0.5, velocity: 0.8 },
      { name: "G4", midi: 67, time: 1.5, duration: 0.5, velocity: 0.8 },
      { name: "A4", midi: 69, time: 2, duration: 0.5, velocity: 0.8 },
      { name: "A4", midi: 69, time: 2.5, duration: 0.5, velocity: 0.8 },
      { name: "G4", midi: 67, time: 3, duration: 1, velocity: 0.8 },
      { name: "F4", midi: 65, time: 4, duration: 0.5, velocity: 0.8 },
      { name: "F4", midi: 65, time: 4.5, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 5, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 5.5, duration: 0.5, velocity: 0.8 },
      { name: "D4", midi: 62, time: 6, duration: 0.5, velocity: 0.8 },
      { name: "D4", midi: 62, time: 6.5, duration: 0.5, velocity: 0.8 },
      { name: "C4", midi: 60, time: 7, duration: 1, velocity: 0.8 },
    ],
  },
  "ode-to-joy": {
    title: "Hymne à la Joie - Beethoven",
    bpm: 110,
    notes: [
      { name: "E4", midi: 64, time: 0, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 0.5, duration: 0.5, velocity: 0.8 },
      { name: "F4", midi: 65, time: 1, duration: 0.5, velocity: 0.8 },
      { name: "G4", midi: 67, time: 1.5, duration: 0.5, velocity: 0.8 },
      { name: "G4", midi: 67, time: 2, duration: 0.5, velocity: 0.8 },
      { name: "F4", midi: 65, time: 2.5, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 3, duration: 0.5, velocity: 0.8 },
      { name: "D4", midi: 62, time: 3.5, duration: 0.5, velocity: 0.8 },
      { name: "C4", midi: 60, time: 4, duration: 0.5, velocity: 0.8 },
      { name: "C4", midi: 60, time: 4.5, duration: 0.5, velocity: 0.8 },
      { name: "D4", midi: 62, time: 5, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 5.5, duration: 0.5, velocity: 0.8 },
      { name: "E4", midi: 64, time: 6, duration: 0.75, velocity: 0.8 },
      { name: "D4", midi: 62, time: 6.75, duration: 0.25, velocity: 0.7 },
      { name: "D4", midi: 62, time: 7, duration: 1, velocity: 0.8 },
    ],
  },
};

export function MidiPlayer({ notes, title, bpm = 120, totalDuration }: MidiPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [midiInputConnected, setMidiInputConnected] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [userNotes, setUserNotes] = useState<Set<number>>(new Set());
  const [correctHits, setCorrectHits] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const scheduledRef = useRef<Set<number>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate bounds
  const minMidi = Math.min(...notes.map(n => n.midi)) - 2;
  const maxMidi = Math.max(...notes.map(n => n.midi)) + 2;
  const duration = totalDuration || Math.max(...notes.map(n => n.time + n.duration)) + 1;

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playMidiNote = useCallback((midi: number, vel: number, dur: number) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(midiToFreq(midi), ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vel * volume, ctx.currentTime + 0.01);
    gain.gain.setValueAtTime(vel * volume, ctx.currentTime + dur * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.01);
  }, [getAudioContext, volume]);

  // Draw piano roll
  const drawPianoRoll = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const noteRange = maxMidi - minMidi + 1;
    const noteH = H / noteRange;
    const pixelsPerSecond = 150;
    const viewStart = time - 1;  // 1 second behind playhead
    const viewEnd = time + (W / pixelsPerSecond);

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    // Piano key labels on left
    for (let m = minMidi; m <= maxMidi; m++) {
      const y = H - (m - minMidi) * noteH - noteH;
      const name = NOTE_NAMES[m % 12];
      const isBlack = name.includes("#");

      // Row background
      ctx.fillStyle = isBlack ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)";
      ctx.fillRect(0, y, W, noteH);

      // Grid line
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Beat lines
    const beatDuration = 60 / bpm;
    const firstBeat = Math.floor(viewStart / beatDuration) * beatDuration;
    for (let t = firstBeat; t < viewEnd; t += beatDuration) {
      const x = (t - viewStart) * pixelsPerSecond;
      ctx.strokeStyle = t % (beatDuration * 4) < 0.01 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)";
      ctx.lineWidth = t % (beatDuration * 4) < 0.01 ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Notes
    for (const note of notes) {
      const x = (note.time - viewStart) * pixelsPerSecond;
      const w = note.duration * pixelsPerSecond;
      const y = H - (note.midi - minMidi) * noteH - noteH;

      if (x + w < 0 || x > W) continue; // off screen

      const isActive = activeNotes.has(note.midi) && note.time <= time && note.time + note.duration >= time;
      const isPast = note.time + note.duration < time;
      const isFuture = note.time > time;

      // Note color
      if (isActive) {
        ctx.fillStyle = "rgba(139, 92, 246, 0.9)"; // purple active
        ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
        ctx.shadowBlur = 12;
      } else if (isPast) {
        ctx.fillStyle = "rgba(139, 92, 246, 0.25)"; // dim past
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "rgba(79, 209, 197, 0.7)"; // teal future
        ctx.shadowBlur = 0;
      }

      // Draw note rectangle
      ctx.beginPath();
      ctx.roundRect(x, y + 1, Math.max(w - 1, 4), noteH - 2, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Note name label
      if (w > 30 && noteH > 10) {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = `${Math.min(10, noteH - 4)}px monospace`;
        ctx.fillText(midiToNoteName(note.midi), x + 4, y + noteH - 4);
      }
    }

    // Playhead
    const playheadX = (time - viewStart) * pixelsPerSecond;
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, H);
    ctx.stroke();

    // Playhead glow
    const gradient = ctx.createLinearGradient(playheadX - 20, 0, playheadX + 20, 0);
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(0.5, "rgba(239, 68, 68, 0.1)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(playheadX - 20, 0, 40, H);

    // User played notes (practice mode)
    if (practiceMode) {
      for (const midi of userNotes) {
        const y = H - (midi - minMidi) * noteH - noteH;
        ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
        ctx.fillRect(playheadX - 4, y, 8, noteH);
      }
    }
  }, [notes, minMidi, maxMidi, activeNotes, bpm, practiceMode, userNotes]);

  // Animation loop
  const tick = useCallback(() => {
    if (!isPlaying) return;
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    setCurrentTime(elapsed);

    // Schedule notes
    const active = new Set<number>();
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.time <= elapsed && note.time + note.duration >= elapsed) {
        active.add(note.midi);
      }
      if (!scheduledRef.current.has(i) && Math.abs(note.time - elapsed) < 0.05) {
        scheduledRef.current.add(i);
        playMidiNote(note.midi, note.velocity, note.duration);
      }
    }
    setActiveNotes(active);

    drawPianoRoll(elapsed);

    if (elapsed >= duration) {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveNotes(new Set());
      scheduledRef.current.clear();
      return;
    }

    animationRef.current = requestAnimationFrame(tick);
  }, [isPlaying, notes, duration, playMidiNote, drawPianoRoll]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, tick]);

  // Initial draw
  useEffect(() => {
    drawPianoRoll(currentTime);
  }, [drawPianoRoll, currentTime]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(2, 2);
      drawPianoRoll(currentTime);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Web MIDI API
  useEffect(() => {
    if (typeof navigator === "undefined" || !("requestMIDIAccess" in navigator)) return;

    (navigator as any).requestMIDIAccess?.().then((access: any) => {
      for (const input of access.inputs.values()) {
        setMidiInputConnected(true);
        input.onmidimessage = (msg: any) => {
          const [status, note, velocity] = msg.data;
          if (status === 144 && velocity > 0) {
            // Note On
            setUserNotes((prev) => new Set([...prev, note]));
            playMidiNote(note, velocity / 127, 0.5);
            // Check if correct in practice mode
            if (practiceMode && activeNotes.has(note)) {
              setCorrectHits((prev) => prev + 1);
            }
          } else if (status === 128 || (status === 144 && velocity === 0)) {
            // Note Off
            setUserNotes((prev) => {
              const next = new Set(prev);
              next.delete(note);
              return next;
            });
          }
        };
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceMode]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
      getAudioContext();
      startTimeRef.current = performance.now() - currentTime * 1000;
      scheduledRef.current.clear();
      // Re-mark scheduled for already-passed notes
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].time < currentTime) scheduledRef.current.add(i);
      }
      setIsPlaying(true);
    }
  };

  const restart = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveNotes(new Set());
    scheduledRef.current.clear();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    drawPianoRoll(0);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mini keyboard at bottom
  const miniKeys = useMemo(() => {
    const keys = [];
    for (let m = minMidi; m <= maxMidi; m++) {
      keys.push({
        midi: m,
        name: NOTE_NAMES[m % 12],
        isBlack: NOTE_NAMES[m % 12].includes("#"),
        isActive: activeNotes.has(m),
        isUser: userNotes.has(m),
      });
    }
    return keys;
  }, [minMidi, maxMidi, activeNotes, userNotes]);

  return (
    <div className="rounded-2xl bg-[oklch(0.12_0.01_280)] border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div>
          <h3 className="font-semibold text-white text-sm">{title || "Lecteur MIDI"}</h3>
          <p className="text-xs text-muted-foreground">{notes.length} notes • {formatTime(duration)}</p>
        </div>
        <div className="flex items-center gap-2">
          {midiInputConnected && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🎹 MIDI connecté
            </span>
          )}
          <button
            onClick={() => setPracticeMode(!practiceMode)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
              practiceMode
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
            }`}
          >
            {practiceMode ? "🎯 Mode Pratique ON" : "Mode Pratique"}
          </button>
        </div>
      </div>

      {/* Piano Roll Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: "280px" }}
        />
      </div>

      {/* Mini Keyboard */}
      <div className="flex h-10 border-t border-white/5 overflow-hidden">
        {miniKeys.filter(k => !k.isBlack).map((key) => (
          <div
            key={key.midi}
            className={`flex-1 border-r border-white/5 transition-all duration-75 ${
              key.isActive
                ? "bg-purple-500/40"
                : key.isUser
                  ? "bg-emerald-500/30"
                  : "bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Button onClick={restart} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button onClick={togglePlay} size="sm" className="h-8 px-4 gradient-bg">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <div className="w-32 md:w-48">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={(val: any) => {
                const value = Array.isArray(val) ? val[0] : val;
                setCurrentTime(value);
                startTimeRef.current = performance.now() - value * 1000;
                drawPianoRoll(value);
              }}
              className="cursor-pointer"
            />
          </div>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-3 h-3 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={(val: any) => setVolume((Array.isArray(val) ? val[0] : val) / 100)}
            max={100}
            className="w-16"
          />
        </div>
      </div>

      {/* Practice score */}
      {practiceMode && (
        <div className="px-4 pb-3 flex items-center gap-4 text-xs">
          <span className="text-emerald-400">✅ Notes correctes : {correctHits}</span>
          <span className="text-muted-foreground">Connectez un clavier MIDI USB et jouez les notes affichées !</span>
        </div>
      )}
    </div>
  );
}
