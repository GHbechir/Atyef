import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
// ThemeProvider removed for Next.js 16 / React 19 compatibility (avoids script tag injection)
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Atyef — Apprenez la Musique en Ligne",
    template: "%s | Atyef",
  },
  description:
    "La plateforme d'apprentissage de musique en ligne. Piano, guitare, batterie et plus. Cours vidéo, outils interactifs et progression personnalisée.",
  keywords: [
    "cours de musique",
    "apprendre piano",
    "apprendre guitare",
    "cours en ligne",
    "musique",
    "leçons",
    "Atyef",
  ],
  authors: [{ name: "Atyef" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Atyef — Apprenez la Musique en Ligne",
    description: "La plateforme de référence pour apprendre, enseigner et gérer votre parcours musical.",
    siteName: "Atyef",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <LanguageProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
