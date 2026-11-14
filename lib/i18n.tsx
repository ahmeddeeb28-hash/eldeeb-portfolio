import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/* ── Language: English or Arabic ─────────────────────
   The landing page reads in either language. Arabic flips the whole
   page right to left and sets it in IBM Plex Sans Arabic, headlines
   and body alike. The font loads only when Arabic is switched on, so
   English visitors don't download it.

   The choice comes from ?lang=ar in the address, then from the last
   choice saved in this browser, and defaults to English.

   In components: const { lang, tr } = useLang();  tr('Work', 'أعمالي') */

export type Lang = 'en' | 'ar';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; tr: <T,>(en: T, ar: T) => T; isAr: boolean };

const LangContext = createContext<Ctx>({ lang: 'en', setLang: () => {}, tr: (en) => en, isAr: false });

const STORE = 'deeb-lang';
const FONT_ID = 'deeb-arabic-fonts';
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
    const saved = window.localStorage.getItem(STORE);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* storage can be blocked; English it is */
  }
  return 'en';
}

function loadArabicFonts() {
  if (document.getElementById(FONT_ID)) return;
  const link = document.createElement('link');
  link.id = FONT_ID;
  link.rel = 'stylesheet';
  link.href = FONT_URL;
  document.head.appendChild(link);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') loadArabicFonts();
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORE, l);
      const url = new URL(window.location.href);
      if (l === 'ar') url.searchParams.set('lang', 'ar');
      else url.searchParams.delete('lang');
      window.history.replaceState(window.history.state, '', url);
    } catch {
      /* fine without storage or history */
    }
  }, []);

  const tr = useCallback(<T,>(en: T, ar: T) => (lang === 'ar' ? ar : en), [lang]);

  return <LangContext.Provider value={{ lang, setLang, tr, isAr: lang === 'ar' }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
