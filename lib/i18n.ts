export type Language = "en" | "fr" | "it" | "de" | "es";

export const languages = [
  { code: "en" as Language, name: "EN", native: "English" },
  { code: "fr" as Language, name: "FR", native: "Français" },
  { code: "it" as Language, name: "IT", native: "Italiano" },
  { code: "de" as Language, name: "DE", native: "Deutsch" },
  { code: "es" as Language, name: "ES", native: "Español" },
];

type TranslationKey = keyof typeof import("./en").default;
import en from "./en";
import fr from "./fr";
import it from "./it";
import de from "./de";
import es from "./es";

export const translations: Record<Language, Record<string, string>> = { en, fr, it, de, es };

export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
