import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import en from "./locales/en.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";

type Lang = "en" | "pt" | "ru";
const dict: Record<Lang, Record<string, string>> = { en, pt, ru };

const I18nCtx = createContext<{ t: (k: string) => string; lang: Lang; setLang: (l: Lang) => void }>({ t: (k) => k, lang: "en", setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = useMemo(() => (key: string) => dict[lang][key] || key, [lang]);
  return <I18nCtx.Provider value={{ t, lang, setLang }}>{children}</I18nCtx.Provider>;
}

export function useI18n() { return useContext(I18nCtx); }