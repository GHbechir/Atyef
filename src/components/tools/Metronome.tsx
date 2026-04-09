"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MetronomeProps {
  className?: string;
}

const TIME_SIGNATURES = [
  { value: "4/4", beats: 4, label: "4/4" },
  { value: "3/4", beats: 3, label: "3/4" },
  { value: "6/8", beats: 6, label: "6/8" },
  { value: "2/4", beats: 2, label: "2/4" },
  { value: "5/4", beats: 5, label: "5/4" },
  { value: "7/8", beats: 7, label: "7/8" },
];

export function Metronome({ className }: MetronomeProps) {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timeSignature, setTimeSignature] = useState("4/4");

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatCountRef = useRef(0);

  const beats = TIME_SIGNATURES.find((ts) => ts.value === timeSignature)?.beats || 4;

  const playClick = useCallback(
    (isAccent: boolean) => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = isAccent ? 1000 : 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(isAccent ? 0.5 : 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    },
    []
  );

  const start = useCallback(() => {
    beatCountRef.current = 0;
    setCurrentBeat(0);
    const intervalMs = (60 / bpm) * 1000;

    // Play first beat immediately
    playClick(true);
    setCurrentBeat(1);
    beatCountRef.current = 1;

    intervalRef.current = setInterval(() => {
      beatCountRef.current = (beatCountRef.current % beats) + 1;
      setCurrentBeat(beatCountRef.current);
      playClick(beatCountRef.current === 1);
    }, intervalMs);

    setIsPlaying(true);
  }, [bpm, beats, playClick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
    beatCountRef.current = 0;
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // Restart when bpm changes while playing
  useEffect(() => {
    if (isPlaying) {
      stop();
      // slight delay to avoid race condition
      const t = setTimeout(() => start(), 50);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, beats]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold font-heading text-white mb-1">Métronome</h2>
        <p className="text-sm text-muted-foreground">Gardez le tempo avec précision</p>
      </div>

      {/* Beat Visualizer */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {Array.from({ length: beats }).map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-100 rounded-full ${
              currentBeat === i + 1
                ? i === 0
                  ? "w-6 h-6 bg-purple-500 shadow-lg shadow-purple-500/50 scale-110"
                  : "w-5 h-5 bg-amber-400 shadow-lg shadow-amber-400/50 scale-110"
                : "w-4 h-4 bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* BPM Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold font-heading text-white mb-1">{bpm}</div>
        <div className="text-sm text-muted-foreground">BPM</div>
      </div>

      {/* BPM Slider */}
      <div className="mb-6 px-2">
        <Slider
          value={[bpm]}
          onValueChange={([val]) => setBpm(val)}
          min={40}
          max={220}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>40</span>
          <span>130</span>
          <span>220</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-white/10 text-white hover:bg-white/10"
          onClick={() => setBpm(Math.max(40, bpm - 5))}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-white/10 text-white hover:bg-white/10"
          onClick={() => setBpm(Math.max(40, bpm - 1))}
        >
          <Minus className="w-3 h-3" />
        </Button>

        <Button
          size="icon"
          className={`w-16 h-16 rounded-full ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "gradient-bg hover:opacity-90"
          } text-white border-0 shadow-xl transition-all`}
          onClick={toggle}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-white/10 text-white hover:bg-white/10"
          onClick={() => setBpm(Math.min(220, bpm + 1))}
        >
          <Plus className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-white/10 text-white hover:bg-white/10"
          onClick={() => setBpm(Math.min(220, bpm + 5))}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Time Signature */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm text-muted-foreground">Mesure :</span>
        <Select value={timeSignature} onValueChange={(v) => { setTimeSignature(v); if (isPlaying) { stop(); } }}>
          <SelectTrigger className="w-24 h-9 bg-white/5 border-white/10 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_SIGNATURES.map((ts) => (
              <SelectItem key={ts.value} value={ts.value}>{ts.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 border-white/10 text-muted-foreground hover:text-white"
          onClick={() => { setBpm(120); stop(); }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Tempo Labels */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {[
          { label: "Largo", min: 40, max: 60 },
          { label: "Adagio", min: 60, max: 80 },
          { label: "Andante", min: 80, max: 100 },
          { label: "Moderato", min: 100, max: 120 },
          { label: "Allegro", min: 120, max: 160 },
          { label: "Presto", min: 160, max: 220 },
        ].map((tempo) => (
          <button
            key={tempo.label}
            onClick={() => setBpm(Math.round((tempo.min + tempo.max) / 2))}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              bpm >= tempo.min && bpm < tempo.max
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            {tempo.label}
          </button>
        ))}
      </div>
    </div>
  );
}
