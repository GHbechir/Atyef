"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/locales/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { setLang, lang } = useLanguage();

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 hover:bg-white/10 h-9 w-9 border border-white/5 bg-white/5 text-foreground">
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Changer la langue</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("fr")} className={lang === "fr" ? "bg-accent" : ""}>
          <span className="mr-2">🇫🇷</span>
          <span>Français</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("en")} className={lang === "en" ? "bg-accent" : ""}>
          <span className="mr-2">🇬🇧</span>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("ar")} className={lang === "ar" ? "bg-accent" : ""}>
          <span className="mr-2">🇹🇳</span>
          <span className="font-arabic">العربية</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
