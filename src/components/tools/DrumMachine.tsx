"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Play, Square, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type Pad = { name: string; key: string; color: string; freq: number; type: "kick" | "snare" | "hihat" | "clap" | "tom" | "ride" | "crash" | "openhat" };

const PADS: Pad[] = [
  { name: "Kick", key: "1", color: "#EF4444", freq: 60, type: "kick" },
  { name: "Snare", key: "2", color: "#F59E0B", freq: 200, type: "snare" },
  { name: "Hi-Hat", key: "3", color: "#10B981", freq: 800, type: "hihat" },
  { name: "Open HH", key: "4", color: "#06B6D4", freq: 600, type: "openhat" },
  { name: "Clap", key: "5", color: "#8B5CF6", freq: 1200, type: "clap" },
  { name: "Tom Hi", key: "6", color: "#EC4899", freq: 300, type: "tom" },
  { name: "Tom Lo", key: "7", color: "#F97316", freq: 150, type: "tom" },
  { name: "Crash", key: "8", color: "#64748B", freq: 1500, type: "crash" },
];

const STEPS = 16;

export function DrumMachine() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [grid, setGrid] = useState<boolean[][]>(
    PADS.map(() => new Array(STEPS).fill(false))
  );
  const [activePads, setActivePads] = useState<Set<number>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((pad: Pad, padIndex: number) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    switch (pad.type) {
      case "kick":
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        break;
      case "snare":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        // Add noise for snare
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
        const noise = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noise.length; i++) noise[i] = Math.random() * 2 - 1;
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        noiseSource.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start();
        break;
      case "hihat":
      case "openhat":
        osc.type = "square";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        filter.type = "highpass";
        filter.frequency.setValueAtTime(7000, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (pad.type === "openhat" ? 0.3 : 0.08));
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        setActivePads((p) => { const next = new Set(p); next.add(padIndex); return next; });
        setTimeout(() => setActivePads((p) => { const next = new Set(p); next.delete(padIndex); return next; }), 100);
        return;
      case "clap":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        break;
      case "tom":
        osc.type = "sine";
        osc.frequency.setValueAtTime(pad.freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pad.freq / 3, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        break;
      case "crash":
      case "ride":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(pad.freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        break;
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    setActivePads((p) => { const next = new Set(p); next.add(padIndex); return next; });
    setTimeout(() => setActivePads((p) => { const next = new Set(p); next.delete(padIndex); return next; }), 100);
  }, [getAudioContext]);

  const toggleCell = (padIndex: number, stepIndex: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[padIndex][stepIndex] = !next[padIndex][stepIndex];
      return next;
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setCurrentStep(-1);
    } else {
      setIsPlaying(true);
      let step = 0;
      const interval = (60 / bpm / 4) * 1000; // 16th notes
      intervalRef.current = setInterval(() => {
        setCurrentStep(step);
        grid.forEach((row, padIndex) => {
          if (row[step]) playSound(PADS[padIndex], padIndex);
        });
        step = (step + 1) % STEPS;
      }, interval);
    }
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentStep(-1);
    setGrid(PADS.map(() => new Array(STEPS).fill(false)));
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Restart playback when BPM changes
  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      let step = currentStep;
      const interval = (60 / bpm / 4) * 1000;
      intervalRef.current = setInterval(() => {
        step = (step + 1) % STEPS;
        setCurrentStep(step);
        grid.forEach((row, padIndex) => {
          if (row[step]) playSound(PADS[padIndex], padIndex);
        });
      }, interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  // Keyboard shortcuts for pads
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const padIndex = PADS.findIndex((p) => p.key === e.key);
      if (padIndex >= 0) playSound(PADS[padIndex], padIndex);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playSound]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={togglePlay} variant="outline" className="gap-2 border-white/10">
          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Stop" : "Play"}
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2 border-white/10">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">BPM</span>
          <Slider
            value={[bpm]}
            onValueChange={(val: number[]) => setBpm(val[0])}
            min={60}
            max={200}
            step={1}
            className="w-32"
          />
          <span className="text-sm font-mono text-white w-8">{bpm}</span>
        </div>
      </div>

      {/* Pads */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {PADS.map((pad, i) => (
          <button
            key={pad.name}
            onClick={() => playSound(pad, i)}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-75 ${
              activePads.has(i)
                ? "scale-95 shadow-lg"
                : "hover:scale-105"
            }`}
            style={{
              borderColor: activePads.has(i) ? pad.color : `${pad.color}40`,
              backgroundColor: activePads.has(i) ? `${pad.color}30` : `${pad.color}10`,
              boxShadow: activePads.has(i) ? `0 0 20px ${pad.color}40` : "none",
            }}
          >
            <span className="text-sm font-bold text-white">{pad.name}</span>
            <span className="text-xs text-muted-foreground">{pad.key}</span>
          </button>
        ))}
      </div>

      {/* Sequencer Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex items-center gap-0.5 mb-1 ml-20">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div key={i} className={`flex-1 text-center text-[9px] ${currentStep === i ? "text-white font-bold" : "text-muted-foreground"}`}>
                {i + 1}
              </div>
            ))}
          </div>
          {PADS.map((pad, padIndex) => (
            <div key={pad.name} className="flex items-center gap-0.5 mb-0.5">
              <span className="w-20 text-xs text-right pr-2 text-muted-foreground truncate shrink-0">{pad.name}</span>
              {grid[padIndex].map((active, stepIndex) => (
                <button
                  key={stepIndex}
                  onClick={() => toggleCell(padIndex, stepIndex)}
                  className={`flex-1 h-7 rounded-sm transition-all duration-75 ${
                    currentStep === stepIndex ? "ring-1 ring-white/30" : ""
                  } ${
                    active
                      ? "scale-[0.95]"
                      : stepIndex % 4 === 0 ? "bg-white/8" : "bg-white/4 hover:bg-white/10"
                  }`}
                  style={active ? { backgroundColor: `${pad.color}60` } : {}}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Appuyez sur les touches 1-8 pour jouer les pads • Cliquez sur la grille pour programmer un pattern
      </p>
    </div>
  );
}
