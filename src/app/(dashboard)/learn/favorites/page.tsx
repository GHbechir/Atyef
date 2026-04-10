"use client";

import { Heart, BookOpen, Music, FileMusic } from "lucide-react";

// Mock favorites data
const FAVORITES = {
  courses: [
    { id: "1", title: "Piano : Les Fondamentaux", teacher: "Marie Laurent", type: "course" as const },
    { id: "2", title: "Blues Guitar Masterclass", teacher: "Marie Laurent", type: "course" as const },
  ],
  partitions: [
    { id: "1", title: "Für Elise", composer: "Beethoven", type: "partition" as const },
    { id: "2", title: "Hymne à la Joie", composer: "Beethoven", type: "partition" as const },
  ],
  songs: [
    { id: "1", title: "Imagine", artist: "John Lennon", type: "song" as const },
    { id: "2", title: "Hallelujah", artist: "Leonard Cohen", type: "song" as const },
  ],
};

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white mb-2">
          ❤️ Mes Favoris
        </h1>
        <p className="text-muted-foreground">
          Retrouvez vos cours, partitions et chansons préférés en un clic
        </p>
      </div>

      {/* Courses */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Cours ({FAVORITES.courses.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAVORITES.courses.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate group-hover:text-purple-400 transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.teacher}</p>
              </div>
              <Heart className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Partitions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileMusic className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Partitions ({FAVORITES.partitions.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAVORITES.partitions.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <FileMusic className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate group-hover:text-cyan-400 transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.composer}</p>
              </div>
              <Heart className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Songs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Chansons ({FAVORITES.songs.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAVORITES.songs.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate group-hover:text-amber-400 transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.artist}</p>
              </div>
              <Heart className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {FAVORITES.courses.length === 0 && FAVORITES.partitions.length === 0 && FAVORITES.songs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💔</p>
          <p className="text-lg text-white font-medium mb-1">Aucun favori pour le moment</p>
          <p className="text-sm text-muted-foreground">Cliquez sur le ❤️ d&apos;un cours ou d&apos;une partition pour l&apos;ajouter ici</p>
        </div>
      )}
    </div>
  );
}
