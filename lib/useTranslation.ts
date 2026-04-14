"use client";

import { useLanguage } from "@/components/LanguageContext";
import { t as translate } from "@/lib/i18n";

// 全局翻译 Hook - 在任何组件中使用
export function useTranslation() {
  const { lang } = useLanguage();
  
  return {
    t: (key: string) => translate(lang, key),
    lang,
  };
}
