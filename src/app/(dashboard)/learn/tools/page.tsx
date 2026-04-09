"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metronome } from "@/components/tools/Metronome";
import { Tuner } from "@/components/tools/Tuner";

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold font-heading text-white">Outils</h1>
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
            Interactifs
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Métronome, accordeur et outils essentiels pour votre pratique musicale.
        </p>
      </motion.div>

      <Tabs defaultValue="metronome" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full sm:w-auto">
          <TabsTrigger
            value="metronome"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎵 Métronome
          </TabsTrigger>
          <TabsTrigger
            value="tuner"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
          >
            🎸 Accordeur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metronome" className="mt-6">
          <div className="max-w-lg mx-auto">
            <Metronome />
          </div>
        </TabsContent>

        <TabsContent value="tuner" className="mt-6">
          <div className="max-w-lg mx-auto">
            <Tuner />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
