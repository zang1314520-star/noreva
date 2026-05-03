"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, languages } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  currentLangName: string;
  allLanguages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  currentLangName: "EN",
  allLanguages: languages,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("noreva-lang") as Language;
    if (saved && ["en", "fr", "it", "de", "es", "zh"].includes(saved)) {
      setLangState(saved);
    } else {
      // 默认英文
      setLangState("en");
      localStorage.setItem("noreva-lang", "en");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("noreva-lang", newLang);
  };

  const langInfo = languages.find(l => l.code === lang);
  const currentLangName = langInfo?.name || "EN";

  return (
    <LanguageContext.Provider value={{ lang, setLang, currentLangName, allLanguages: languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
