import { create } from "zustand";

interface LessonState {
  // Course/Lesson Context
  courseId: string | null;
  lessonId: string | null;
  
  // Video Player State
  isVideoPlaying: boolean;
  videoCurrentTime: number;
  videoDuration: number;

  // Active Tool state
  activeTool: "partition" | "guitar-tab" | "midi" | null;
  
  // Metronome & Playback Global State
  globalBpm: number;
  isPlayingMusic: boolean;
  
  // Actions
  setContext: (courseId: string, lessonId: string) => void;
  setVideoState: (playing: boolean, time?: number) => void;
  setVideoDuration: (duration: number) => void;
  setActiveTool: (tool: "partition" | "guitar-tab" | "midi" | null) => void;
  setGlobalBpm: (bpm: number) => void;
  toggleMusicPlayback: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  courseId: null,
  lessonId: null,

  isVideoPlaying: false,
  videoCurrentTime: 0,
  videoDuration: 0,

  activeTool: "partition",

  globalBpm: 120,
  isPlayingMusic: false,

  setContext: (courseId, lessonId) => set({ courseId, lessonId }),
  
  setVideoState: (playing, time) => 
    set((state) => ({ 
      isVideoPlaying: playing, 
      videoCurrentTime: time !== undefined ? time : state.videoCurrentTime 
    })),
    
  setVideoDuration: (duration) => set({ videoDuration: duration }),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setGlobalBpm: (bpm) => set({ globalBpm: bpm }),
  
  toggleMusicPlayback: () => set((state) => ({ isPlayingMusic: !state.isPlayingMusic })),
}));
