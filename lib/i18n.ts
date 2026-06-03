export type Language = "en" | "fr" | "it" | "de" | "es" | "zh";

export const languages = [
  { code: "en" as Language, name: "EN", native: "English" },
  { code: "fr" as Language, name: "FR", native: "Francais" },
  { code: "it" as Language, name: "IT", native: "Italiano" },
  { code: "de" as Language, name: "DE", native: "Deutsch" },
  { code: "es" as Language, name: "ES", native: "Espanol" },
  { code: "zh" as Language, name: "中文", native: "中文" },
];

import en from "./en";
import fr from "./fr";
import it from "./it";
import de from "./de";
import es from "./es";
import zh from "./zh";

export const translations: Record<Language, Record<string, string>> = {
  en,
  fr,
  it,
  de,
  es,
  zh,
};

export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getTranslations(lang: Language): Record<string, string> {
  return translations[lang] || translations.en;
}
