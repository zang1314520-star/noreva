"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, languages } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  currentLangName: string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  currentLangName: "EN",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("noreva-lang") as Language;
    if (saved && ["en", "zh", "fr", "it", "de", "es"].includes(saved)) {
      setLangState(saved);
    } else {
      setLangState("zh");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("noreva-lang", newLang);
  };

  const langInfo = languages.find(l => l.code === lang);
  const currentLangName = langInfo?.name || "中文";

  return (
    <LanguageContext.Provider value={{ lang, setLang, currentLangName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
