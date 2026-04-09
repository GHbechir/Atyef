"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music2, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const instruments = [
  { id: "piano", name: "Piano / Clavier", icon: "🎹", color: "#6C3CE1", description: "Classique, jazz, pop et plus encore" },
  { id: "guitare", name: "Guitare", icon: "🎸", color: "#F59E0B", description: "Acoustique et électrique, tous styles" },
  { id: "basse", name: "Basse", icon: "🎸", color: "#10B981", description: "Grooves, slap et walking bass" },
  { id: "batterie", name: "Batterie", icon: "🥁", color: "#EF4444", description: "Rythmes, rudiments et coordination" },
  { id: "chant", name: "Chant / Voix", icon: "🎤", color: "#EC4899", description: "Technique vocale et interprétation" },
];

const levels = [
  { id: "BEGINNER", name: "Débutant", icon: "🌱", description: "Je n'ai jamais joué ou très peu" },
  { id: "INTERMEDIATE", name: "Intermédiaire", icon: "🌿", description: "Je connais les bases et je veux progresser" },
  { id: "ADVANCED", name: "Avancé", icon: "🌳", description: "Je maîtrise mon instrument et je veux me perfectionner" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const router = useRouter();

  const handleComplete = () => {
    // In production, save to database via API route
    router.push("/learn");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Music2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold font-heading">
          Aty<span className="gradient-text-purple">ef</span>
        </span>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-12">
        <div className={`w-10 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/10"}`} />
        <div className={`w-10 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/10"}`} />
        <div className={`w-10 h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/10"}`} />
      </div>

      {/* Step 1: Choose Instrument */}
      {step === 1 && (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
          <h1 className="text-3xl font-bold font-heading text-center text-white mb-2">
            Quel instrument souhaitez-vous apprendre ?
          </h1>
          <p className="text-muted-foreground text-center mb-10">
            Votre abonnement vous donnera accès à tous les cours de cet instrument
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {instruments.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstrument(inst.id)}
                className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  selectedInstrument === inst.id
                    ? "border-purple-500 bg-purple-500/10 scale-[1.02] shadow-lg shadow-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                {selectedInstrument === inst.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <span className="text-4xl">{inst.icon}</span>
                <div>
                  <p className="font-semibold text-white">{inst.name}</p>
                  <p className="text-sm text-muted-foreground">{inst.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              disabled={!selectedInstrument}
              onClick={() => setStep(2)}
              className="px-8 py-6 text-base gradient-bg hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Continuer <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Level */}
      {step === 2 && (
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-right-4 duration-500">
          <h1 className="text-3xl font-bold font-heading text-center text-white mb-2">
            Quel est votre niveau ?
          </h1>
          <p className="text-muted-foreground text-center mb-10">
            Nous adapterons votre parcours d&apos;apprentissage en fonction
          </p>

          <div className="space-y-4">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedLevel === lvl.id
                    ? "border-purple-500 bg-purple-500/10 scale-[1.02] shadow-lg shadow-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                {selectedLevel === lvl.id && (
                  <div className="absolute right-5 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <span className="text-3xl">{lvl.icon}</span>
                <div>
                  <p className="font-semibold text-white">{lvl.name}</p>
                  <p className="text-sm text-muted-foreground">{lvl.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStep(1)}
              className="px-6 py-6 border-white/10"
            >
              Retour
            </Button>
            <Button
              size="lg"
              disabled={!selectedLevel}
              onClick={() => setStep(3)}
              className="px-8 py-6 text-base gradient-bg hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Continuer <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Ready */}
      {step === 3 && (
        <div className="w-full max-w-lg text-center animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold font-heading text-white mb-3">
            Votre espace est prêt !
          </h1>
          <p className="text-muted-foreground mb-2">
            Instrument : <span className="text-white font-medium">{instruments.find(i => i.id === selectedInstrument)?.name}</span>
          </p>
          <p className="text-muted-foreground mb-8">
            Niveau : <span className="text-white font-medium">{levels.find(l => l.id === selectedLevel)?.name}</span>
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            Nous avons préparé des cours adaptés à votre niveau. Vous aurez également accès aux cours de théorie musicale et solfège (communs à tous les instruments).
          </p>

          <Button
            size="lg"
            onClick={handleComplete}
            className="px-10 py-6 text-lg gradient-bg hover:opacity-90 transition-opacity"
          >
            Commencer à apprendre 🚀
          </Button>
        </div>
      )}
    </div>
  );
}
