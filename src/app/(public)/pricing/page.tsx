"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/mock-data";

const faq = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, vous pouvez résilier votre abonnement à tout moment sans frais. Vous conservez l'accès jusqu'à la fin de votre période en cours.",
  },
  {
    q: "Y a-t-il un essai gratuit ?",
    a: "Oui, vous bénéficiez de 7 jours d'essai gratuit sur tous nos plans. Aucune carte bancaire requise pour commencer.",
  },
  {
    q: "Puis-je changer de plan ?",
    a: "Absolument ! Vous pouvez passer de Basic à VIP (ou inversement) à tout moment. Le changement est effectif immédiatement.",
  },
  {
    q: "Les cours sont-ils accessibles hors ligne ?",
    a: "Avec l'application mobile (VIP), vous pouvez télécharger les cours pour les regarder hors ligne.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs border-amber-500/30 text-amber-300 bg-amber-500/10"
          >
            Tarifs transparents
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">
            Investissez dans votre{" "}
            <span className="gradient-text">passion</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Deux formules simples. Sans engagement. Essai gratuit de 7 jours.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "glass-card border-2 border-purple-500/40 shadow-xl shadow-purple-500/10"
                  : "glass-card"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-bg text-white border-0 px-4 py-1 text-xs shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Recommandé
                  </Badge>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-heading text-white mb-1">
                  {plan.name}
                </h2>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold font-heading text-white">
                  {plan.price.toFixed(2).replace(".", ",")} €
                </span>
                <span className="text-muted-foreground text-lg">/ {plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-8">
                Soit {(plan.price * 12 * 0.8).toFixed(2).replace(".", ",")} €/an avec l&apos;offre annuelle (-20%)
              </p>
              <Link href="/sign-up">
                <Button
                  className={`w-full h-12 text-base font-medium mb-8 group ${
                    plan.popular
                      ? "gradient-bg text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm opacity-40">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
            Questions fréquentes
          </h2>
        </motion.div>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-xl p-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
