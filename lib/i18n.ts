// 全局语言类型
export type Language = "en" | "fr" | "it" | "de" | "es";

export const languages = [
  { code: "en" as Language, name: "EN", native: "English" },
  { code: "fr" as Language, name: "FR", native: "Français" },
  { code: "it" as Language, name: "IT", native: "Italiano" },
  { code: "de" as Language, name: "DE", native: "Deutsch" },
  { code: "es" as Language, name: "ES", native: "Español" },
];

// 导入所有翻译
import en from "./en";
import fr from "./fr";
import it from "./it";
import de from "./de";
import es from "./es";

export const translations: Record<Language, Record<string, string>> = { en, fr, it, de, es };

// 全局翻译函数
export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

// 获取当前语言的所有翻译
export function getTranslations(lang: Language): Record<string, string> {
  return translations[lang] || translations.en;
}
