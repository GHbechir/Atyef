import { ar, fr, en } from "./index";

export type Language = "ar" | "fr" | "en";

export type Translations = typeof fr; // Use French as the base type for TypeScript

type LocalesType = {
  ar: Translations;
  fr: Translations;
  en: Translations;
};

export const locales: LocalesType = { ar, fr, en };
