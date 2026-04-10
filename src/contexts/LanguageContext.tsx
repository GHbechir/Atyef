"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, locales, Translations } from "@/locales/types";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof Translations) => string | undefined;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with 'ar' since we want Taki Academy vibes as priority? Let's use 'fr' as default to match previous design, but maybe 'ar' is what user wants.
  // Actually let's default to 'ar' for Taki Academy style.
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    const savedLang = localStorage.getItem("atyef-lang") as Language;
    if (savedLang && (savedLang === "ar" || savedLang === "en" || savedLang === "fr")) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("atyef-lang", newLang);
  };

  const t = (key: keyof Translations): string => {
    return locales[lang][key] || locales["fr"][key] || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  // Force direction on document body dynamically for the whole app
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {/* We apply 'dir' on a wrapper to ensure child RTL computation works immediately before React mounts fully, but it's mainly handled by document element */}
      <div dir={dir} className="w-full h-full min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
