"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Play, Square, Trash2, Download, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordings, setRecordings] = useState<{ url: string; name: string; duration: number; date: Date }[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startLevelMeter = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(avg / 255);
      animationRef.current = requestAnimationFrame(update);
    };
    update();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings((prev) => [
          ...prev,
          {
            url,
            name: `Enregistrement ${prev.length + 1}`,
            duration: recordingTime,
            date: new Date(),
          },
        ]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      startLevelMeter(stream);
    } catch {
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setAudioLevel(0);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const playRecording = (index: number) => {
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(recordings[index].url);
    audioRef.current = audio;
    audio.onended = () => setPlayingIndex(null);
    audio.play();
    setPlayingIndex(index);
  };

  const deleteRecording = (index: number) => {
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
    }
    URL.revokeObjectURL(recordings[index].url);
    setRecordings((prev) => prev.filter((_, i) => i !== index));
  };

  const downloadRecording = (index: number) => {
    const a = document.createElement("a");
    a.href = recordings[index].url;
    a.download = `${recordings[index].name}.webm`;
    a.click();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioRef.current) audioRef.current.pause();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      recordings.forEach((r) => URL.revokeObjectURL(r.url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* Main Recorder */}
      <div className="flex flex-col items-center">
        {/* Level Meter Visualization */}
        <div className="relative mb-6">
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? "bg-red-500/20 border-2 border-red-500/50"
                : "bg-white/5 border-2 border-white/10"
            }`}
            style={{
              transform: isRecording ? `scale(${1 + audioLevel * 0.3})` : "scale(1)",
              boxShadow: isRecording ? `0 0 ${40 + audioLevel * 60}px rgba(239, 68, 68, ${0.2 + audioLevel * 0.3})` : "none",
            }}
          >
            {isRecording ? (
              <div className="text-center">
                <Mic className={`w-10 h-10 mx-auto mb-1 ${isPaused ? "text-yellow-400" : "text-red-400 animate-pulse"}`} />
                <span className="text-2xl font-mono font-bold text-white">{formatTime(recordingTime)}</span>
                <p className="text-[10px] text-red-300 mt-1">{isPaused ? "EN PAUSE" : "ENREGISTREMENT"}</p>
              </div>
            ) : (
              <div className="text-center">
                <Mic className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Prêt</p>
              </div>
            )}
          </div>

          {/* Level bars around circle */}
          {isRecording && (
            <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 rounded-full bg-red-400/60 transition-all duration-75"
                  style={{
                    height: `${8 + audioLevel * 30}px`,
                    transform: `rotate(${i * 30}deg) translateY(-${80 + audioLevel * 10}px)`,
                    opacity: audioLevel > 0.1 ? 0.3 + audioLevel * 0.7 : 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600 gap-2 px-8">
              <Mic className="w-5 h-5" /> Enregistrer
            </Button>
          ) : (
            <>
              <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2 border-white/10">
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? "Reprendre" : "Pause"}
              </Button>
              <Button onClick={stopRecording} size="lg" className="bg-red-500 hover:bg-red-600 gap-2">
                <Square className="w-4 h-4" /> Arrêter
              </Button>
            </>
          )}
        </div>

        {hasPermission === false && (
          <p className="text-sm text-red-400 mt-4">
            ⚠️ Accès au microphone refusé. Veuillez autoriser l&apos;accès dans les paramètres de votre navigateur.
          </p>
        )}
      </div>

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Mes enregistrements ({recordings.length})
          </h3>
          <div className="space-y-3">
            {recordings.map((rec, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  playingIndex === i
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <button
                  onClick={() => playRecording(i)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    playingIndex === i
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {playingIndex === i ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{rec.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(rec.duration)} • {rec.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => downloadRecording(i)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRecording(i)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Enregistrez-vous pour écouter votre progression • Les enregistrements restent dans votre navigateur
      </p>
    </div>
  );
}
