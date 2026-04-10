"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Square, Mic, MicOff, RotateCcw, Volume2, Settings2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Guitar string frequencies (standard tuning E2-E4)
const STRINGS = [
  { name: "e", note: "E4", freq: 329.63, color: "#EC4899" },  // 1st (thinnest)
  { name: "B", note: "B3", freq: 246.94, color: "#8B5CF6" },
  { name: "G", note: "G3", freq: 196.00, color: "#3B82F6" },
  { name: "D", note: "D3", freq: 146.83, color: "#10B981" },
  { name: "A", note: "A2", freq: 110.00, color: "#F59E0B" },
  { name: "E", note: "E2", freq: 82.41, color: "#EF4444" },   // 6th (thickest)
];

// Fret frequency calculation
function fretFreq(stringFreq: number, fret: number): number {
  return stringFreq * Math.pow(2, fret / 12);
}

// Tab note type
type TabNote = {
  string: number;  // 0-5 (e to E)
  fret: number;    // 0-24
  time: number;    // beat position
  duration: number; // in beats
  played?: boolean;
  missed?: boolean;
};

// Demo songs in tab format
const DEMO_TABS: Record<string, { title: string; artist: string; bpm: number; notes: TabNote[] }> = {
  "smoke-on-the-water": {
    title: "Smoke on the Water",
    artist: "Deep Purple",
    bpm: 112,
    notes: [
      // Riff principale
      { string: 3, fret: 0, time: 0, duration: 1 }, { string: 4, fret: 0, time: 0, duration: 1 },
      { string: 3, fret: 3, time: 1.5, duration: 1 }, { string: 4, fret: 3, time: 1.5, duration: 1 },
      { string: 3, fret: 5, time: 3, duration: 1.5 }, { string: 4, fret: 5, time: 3, duration: 1.5 },
      { string: 3, fret: 0, time: 5, duration: 1 }, { string: 4, fret: 0, time: 5, duration: 1 },
      { string: 3, fret: 3, time: 6.5, duration: 1 }, { string: 4, fret: 3, time: 6.5, duration: 1 },
      { string: 3, fret: 6, time: 8, duration: 0.5 }, { string: 4, fret: 6, time: 8, duration: 0.5 },
      { string: 3, fret: 5, time: 8.5, duration: 2 }, { string: 4, fret: 5, time: 8.5, duration: 2 },
      // Repeat
      { string: 3, fret: 0, time: 11, duration: 1 }, { string: 4, fret: 0, time: 11, duration: 1 },
      { string: 3, fret: 3, time: 12.5, duration: 1 }, { string: 4, fret: 3, time: 12.5, duration: 1 },
      { string: 3, fret: 5, time: 14, duration: 1.5 }, { string: 4, fret: 5, time: 14, duration: 1.5 },
      { string: 3, fret: 3, time: 16, duration: 1 }, { string: 4, fret: 3, time: 16, duration: 1 },
      { string: 3, fret: 0, time: 17.5, duration: 2.5 }, { string: 4, fret: 0, time: 17.5, duration: 2.5 },
    ],
  },
  "seven-nation-army": {
    title: "Seven Nation Army",
    artist: "The White Stripes",
    bpm: 124,
    notes: [
      { string: 4, fret: 7, time: 0, duration: 1.5 },
      { string: 4, fret: 7, time: 2, duration: 0.5 },
      { string: 4, fret: 10, time: 3, duration: 1 },
      { string: 4, fret: 7, time: 4.5, duration: 0.75 },
      { string: 4, fret: 5, time: 5.5, duration: 1 },
      { string: 4, fret: 3, time: 7, duration: 2 },
      { string: 4, fret: 2, time: 9.5, duration: 2 },
      // Repeat
      { string: 4, fret: 7, time: 12, duration: 1.5 },
      { string: 4, fret: 7, time: 14, duration: 0.5 },
      { string: 4, fret: 10, time: 15, duration: 1 },
      { string: 4, fret: 7, time: 16.5, duration: 0.75 },
      { string: 4, fret: 5, time: 17.5, duration: 1 },
      { string: 4, fret: 3, time: 19, duration: 2 },
      { string: 4, fret: 2, time: 21.5, duration: 2 },
    ],
  },
  "come-as-you-are": {
    title: "Come As You Are",
    artist: "Nirvana",
    bpm: 120,
    notes: [
      { string: 3, fret: 0, time: 0, duration: 0.5 },
      { string: 3, fret: 0, time: 0.5, duration: 0.5 },
      { string: 3, fret: 1, time: 1, duration: 0.5 },
      { string: 3, fret: 2, time: 1.5, duration: 0.5 },
      { string: 4, fret: 2, time: 2, duration: 0.5 },
      { string: 4, fret: 2, time: 2.5, duration: 0.5 },
      { string: 4, fret: 1, time: 3, duration: 0.5 },
      { string: 4, fret: 0, time: 3.5, duration: 0.5 },
      { string: 3, fret: 0, time: 4, duration: 0.5 },
      { string: 3, fret: 0, time: 4.5, duration: 0.5 },
      { string: 3, fret: 1, time: 5, duration: 0.5 },
      { string: 3, fret: 2, time: 5.5, duration: 0.5 },
      { string: 4, fret: 2, time: 6, duration: 0.5 },
      { string: 4, fret: 2, time: 6.5, duration: 0.5 },
      { string: 3, fret: 2, time: 7, duration: 0.5 },
      { string: 3, fret: 2, time: 7.5, duration: 0.5 },
      { string: 3, fret: 0, time: 8, duration: 0.5 },
      { string: 3, fret: 0, time: 8.5, duration: 0.5 },
      { string: 3, fret: 1, time: 9, duration: 0.5 },
      { string: 3, fret: 2, time: 9.5, duration: 0.5 },
    ],
  },
};

// Autocorrelation pitch detection
function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null; // too quiet

  // Autocorrelation
  const corr = new Float32Array(SIZE);
  for (let lag = 0; lag < SIZE; lag++) {
    let sum = 0;
    for (let i = 0; i < SIZE - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    corr[lag] = sum;
  }

  // Find first dip then peak
  let d = 0;
  while (corr[d] > corr[d + 1] && d < SIZE - 1) d++;

  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < SIZE; i++) {
    if (corr[i] > maxVal) {
      maxVal = corr[i];
      maxPos = i;
    }
  }

  if (maxPos === -1 || maxVal < corr[0] * 0.3) return null;
  return sampleRate / maxPos;
}

export function GuitarTabPlayer() {
  const [selectedSong, setSelectedSong] = useState("smoke-on-the-water");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [score, setScore] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [hitNotes, setHitNotes] = useState(0);
  const [detectedFreq, setDetectedFreq] = useState<number | null>(null);
  const [speed, setSpeed] = useState(100); // percentage of original BPM
  const [volume, setVolume] = useState(0.5);
  const [tabNotes, setTabNotes] = useState<TabNote[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const playedSetRef = useRef<Set<number>>(new Set());

  const song = DEMO_TABS[selectedSong];
  const effectiveBpm = (song.bpm * speed) / 100;
  const beatDuration = 60 / effectiveBpm;
  const totalBeats = Math.max(...song.notes.map(n => n.time + n.duration)) + 4;

  // Initialize tab notes
  useEffect(() => {
    setTabNotes(song.notes.map(n => ({ ...n, played: false, missed: false })));
    setScore(0);
    setHitNotes(0);
    setTotalNotes(song.notes.length);
    setCurrentBeat(0);
    playedSetRef.current.clear();
  }, [selectedSong, song.notes]);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  }, []);

  // Play a guitar-like sound
  const playGuitarNote = useCallback((stringIdx: number, fret: number, dur: number) => {
    const ctx = getAudioCtx();
    const freq = fretFreq(STRINGS[stringIdx].freq, fret);

    // Multiple harmonics for richer sound
    const harmonics = [1, 2, 3, 4];
    const gains = [1, 0.5, 0.25, 0.12];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur * beatDuration * 1.5);
    masterGain.connect(ctx.destination);

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq * h, ctx.currentTime);
      gain.gain.setValueAtTime(gains[i] * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur * beatDuration * 1.2);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + dur * beatDuration * 1.5);
    });
  }, [getAudioCtx, volume, beatDuration]);

  // Pitch detection loop
  const detectLoop = useCallback(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    const freq = detectPitch(buffer, analyser.context.sampleRate);
    setDetectedFreq(freq);
  }, []);

  // Enable microphone
  const toggleMic = async () => {
    if (micEnabled) {
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      setMicEnabled(false);
      setDetectedFreq(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = getAudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicEnabled(true);
    } catch {
      alert("Impossible d'accéder au microphone");
    }
  };

  // Draw the scrolling tab
  const draw = useCallback((beat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width / 2;
    const H = canvas.height / 2;
    ctx.save();
    ctx.scale(2, 2);

    // Clear
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    const MARGIN_LEFT = 40;
    const MARGIN_RIGHT = 20;
    const PLAY_AREA = W - MARGIN_LEFT - MARGIN_RIGHT;
    const STRING_SPACING = (H - 60) / 5;
    const STRING_TOP = 30;
    const PLAYHEAD_X = MARGIN_LEFT + 80;
    const BEATS_VISIBLE = 10;
    const PX_PER_BEAT = PLAY_AREA / BEATS_VISIBLE;

    // Draw strings
    for (let s = 0; s < 6; s++) {
      const y = STRING_TOP + s * STRING_SPACING;
      const thickness = 1 + s * 0.3;

      // String line
      ctx.strokeStyle = `rgba(255,255,255,${0.12 + s * 0.02})`;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(MARGIN_LEFT, y);
      ctx.lineTo(W - MARGIN_RIGHT, y);
      ctx.stroke();

      // String label
      ctx.fillStyle = STRINGS[s].color;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "right";
      ctx.fillText(STRINGS[s].name, MARGIN_LEFT - 8, y + 4);
    }

    // Beat grid lines
    const firstBeat = Math.floor(beat - 2);
    for (let b = firstBeat; b < beat + BEATS_VISIBLE + 2; b++) {
      if (b < 0) continue;
      const x = PLAYHEAD_X + (b - beat) * PX_PER_BEAT;
      if (x < MARGIN_LEFT || x > W - MARGIN_RIGHT) continue;

      ctx.strokeStyle = b % 4 === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)";
      ctx.lineWidth = b % 4 === 0 ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x, STRING_TOP - 10);
      ctx.lineTo(x, STRING_TOP + 5 * STRING_SPACING + 10);
      ctx.stroke();

      // Beat number at top
      if (b % 4 === 0 && b >= 0) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.floor(b / 4) + 1}`, x, STRING_TOP - 14);
      }
    }

    // Draw notes
    for (let i = 0; i < tabNotes.length; i++) {
      const note = tabNotes[i];
      const x = PLAYHEAD_X + (note.time - beat) * PX_PER_BEAT;
      const noteW = note.duration * PX_PER_BEAT;
      const y = STRING_TOP + note.string * STRING_SPACING;

      if (x + noteW < MARGIN_LEFT - 20 || x > W) continue;

      const isPast = note.time + note.duration < beat;
      const isActive = note.time <= beat && note.time + note.duration > beat;
      const isFuture = note.time > beat;

      // Note tail (duration bar)
      if (noteW > 20) {
        ctx.fillStyle = note.played
          ? "rgba(16, 185, 129, 0.2)"
          : note.missed
            ? "rgba(239, 68, 68, 0.15)"
            : isActive
              ? `${STRINGS[note.string].color}30`
              : isFuture
                ? `${STRINGS[note.string].color}15`
                : "rgba(255,255,255,0.03)";
        ctx.beginPath();
        ctx.roundRect(x, y - 11, noteW - 2, 22, 6);
        ctx.fill();
      }

      // Note circle
      const radius = 14;
      let fillColor: string;
      let strokeColor: string;
      let textColor = "#fff";

      if (note.played) {
        fillColor = "rgba(16, 185, 129, 0.9)";
        strokeColor = "#10B981";
      } else if (note.missed) {
        fillColor = "rgba(239, 68, 68, 0.6)";
        strokeColor = "#EF4444";
      } else if (isActive) {
        fillColor = STRINGS[note.string].color;
        strokeColor = "#fff";
      } else if (isFuture) {
        fillColor = `${STRINGS[note.string].color}CC`;
        strokeColor = `${STRINGS[note.string].color}`;
      } else {
        fillColor = "rgba(255,255,255,0.1)";
        strokeColor = "rgba(255,255,255,0.2)";
        textColor = "rgba(255,255,255,0.4)";
      }

      // Shadow for active notes
      if (isActive) {
        ctx.shadowColor = STRINGS[note.string].color;
        ctx.shadowBlur = 15;
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fret number
      ctx.fillStyle = textColor;
      ctx.font = `bold ${note.fret >= 10 ? 11 : 13}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(note.fret), x, y + 1);
    }

    // Playhead
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(PLAYHEAD_X, STRING_TOP - 15);
    ctx.lineTo(PLAYHEAD_X, STRING_TOP + 5 * STRING_SPACING + 15);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Playhead arrow
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(PLAYHEAD_X - 6, STRING_TOP - 18);
    ctx.lineTo(PLAYHEAD_X + 6, STRING_TOP - 18);
    ctx.lineTo(PLAYHEAD_X, STRING_TOP - 12);
    ctx.closePath();
    ctx.fill();

    // Status bar at bottom
    const barY = H - 22;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(0, barY - 5, W, 30);

    // Progress bar
    const progress = beat / totalBeats;
    ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
    ctx.fillRect(MARGIN_LEFT, barY, PLAY_AREA * progress, 4);
    ctx.fillStyle = "#8B5CF6";
    ctx.fillRect(MARGIN_LEFT, barY, Math.max(PLAY_AREA * progress, 2), 4);

    ctx.restore();
  }, [tabNotes, totalBeats]);

  // Animation loop
  const tick = useCallback(() => {
    if (!isPlaying) return;

    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const beat = elapsed / beatDuration;
    setCurrentBeat(beat);

    // Schedule sounds and check hits
    for (let i = 0; i < tabNotes.length; i++) {
      const note = tabNotes[i];
      if (playedSetRef.current.has(i)) continue;

      // Play sound when note reaches playhead
      if (note.time <= beat && note.time + 0.1 > beat) {
        playGuitarNote(note.string, note.fret, note.duration);
        playedSetRef.current.add(i);

        if (micEnabled) {
          // Check if detected frequency matches
          if (detectedFreq) {
            const expectedFreq = fretFreq(STRINGS[note.string].freq, note.fret);
            const ratio = detectedFreq / expectedFreq;
            if (ratio > 0.95 && ratio < 1.05) {
              setTabNotes(prev => {
                const next = [...prev];
                next[i] = { ...next[i], played: true };
                return next;
              });
              setHitNotes(prev => prev + 1);
            }
          }

          // Auto-mark as played in demo mode (no mic = auto-pass)
          setTabNotes(prev => {
            const next = [...prev];
            next[i] = { ...next[i], played: true };
            return next;
          });
          setHitNotes(prev => prev + 1);
        } else {
          // No mic mode: auto-mark as played
          setTabNotes(prev => {
            const next = [...prev];
            next[i] = { ...next[i], played: true };
            return next;
          });
          setHitNotes(prev => prev + 1);
        }
      }

      // Mark as missed if past
      if (!note.played && !note.missed && note.time + note.duration + 0.5 < beat) {
        setTabNotes(prev => {
          const next = [...prev];
          next[i] = { ...next[i], missed: true };
          return next;
        });
      }
    }

    // Update score
    const playedCount = tabNotes.filter(n => n.played).length;
    if (tabNotes.length > 0) {
      setScore(Math.round((playedCount / tabNotes.length) * 100));
    }

    // Pitch detection
    if (micEnabled) detectLoop();

    // Draw
    draw(beat);

    // Check if song ended
    if (beat > totalBeats) {
      setIsPlaying(false);
      return;
    }

    animFrameRef.current = requestAnimationFrame(tick);
  }, [isPlaying, beatDuration, tabNotes, micEnabled, detectedFreq, totalBeats, playGuitarNote, detectLoop, draw]);

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, tick]);

  // Initial draw
  useEffect(() => { draw(0); }, [draw]);

  // Canvas resize
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
      cancelAnimationFrame(animFrameRef.current);
    } else {
      getAudioCtx();
      startTimeRef.current = performance.now() - currentBeat * beatDuration * 1000;
      playedSetRef.current.clear();
      setIsPlaying(true);
    }
  };

  const restart = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
    setCurrentBeat(0);
    playedSetRef.current.clear();
    setTabNotes(song.notes.map(n => ({ ...n, played: false, missed: false })));
    setHitNotes(0);
    setScore(0);
    draw(0);
  };

  const changeSong = (key: string) => {
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
    setSelectedSong(key);
    setCurrentBeat(0);
    playedSetRef.current.clear();
  };

  return (
    <div className="space-y-4">
      {/* Song selector & controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedSong} onValueChange={(val) => val && changeSong(val)}>
          <SelectTrigger className="w-[280px] bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DEMO_TABS).map(([key, s]) => (
              <SelectItem key={key} value={key}>
                {s.title} — {s.artist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Vitesse</span>
          <Select value={String(speed)} onValueChange={(v) => v && setSpeed(Number(v))}>
            <SelectTrigger className="w-[90px] bg-white/5 border-white/10 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main canvas */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a12]">
        <canvas
          ref={canvasRef}
          className="w-full cursor-default"
          style={{ height: "320px" }}
        />
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <Button onClick={restart} variant="ghost" size="sm" className="h-9 w-9 p-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={togglePlay} size="sm" className="h-9 px-5 gradient-bg">
            {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button
            onClick={toggleMic}
            variant="ghost"
            size="sm"
            className={`h-9 gap-1.5 ${micEnabled ? "text-emerald-400 bg-emerald-500/10" : ""}`}
          >
            {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="text-xs hidden sm:inline">{micEnabled ? "Micro ON" : "Micro"}</span>
          </Button>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white font-mono">{score}%</p>
            <p className="text-[10px] text-muted-foreground">Score</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-lg font-bold text-emerald-400">{hitNotes}</p>
            <p className="text-[10px] text-muted-foreground">Notes</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-lg font-bold text-white">{effectiveBpm.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground">BPM</p>
          </div>
        </div>

        {/* Volume */}
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

      {/* Detected frequency indicator */}
      {micEnabled && (
        <div className="flex items-center justify-center gap-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Microphone actif
          </span>
          {detectedFreq && (
            <span className="font-mono text-emerald-400">
              {detectedFreq.toFixed(1)} Hz
            </span>
          )}
          <span>Jouez les notes quand elles arrivent sur la ligne blanche !</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> Réussie
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" /> Ratée
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STRINGS[0].color }} /> Note à jouer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-white rounded" /> Playhead
        </span>
      </div>
    </div>
  );
}
