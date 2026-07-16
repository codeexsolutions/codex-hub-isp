import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildTokens, hexA } from "../theme/tokens";
import { DEFAULT_PROVIDER } from "../data/providers";

const ThemeCtx = createContext(null);
export const useTheme = () => useContext(ThemeCtx);

const load = (k, fb) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; }
};

export function ThemeProvider({ children }) {
  const [provider, setProviderState] = useState(() => load("ca:provider", DEFAULT_PROVIDER));
  const [dark, setDarkState] = useState(() => load("ca:dark", false));

  const setProvider = (p) => { setProviderState(p); localStorage.setItem("ca:provider", JSON.stringify(p)); };
  const setDark = (v) => { setDarkState(v); localStorage.setItem("ca:dark", JSON.stringify(v)); };

  const t = useMemo(() => buildTokens(dark), [dark]);
  const A = provider.accent;
  const A2 = provider.accent2;

  // expõe os tokens como CSS vars globais (usadas no index.css e nos componentes)
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--a", A);
    r.setProperty("--a2", A2);
    Object.entries(t).forEach(([k, v]) => r.setProperty(`--${k}`, v));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.surface);
  }, [t, A, A2]);

  const value = useMemo(
    () => ({ provider, setProvider, dark, setDark, t, A, A2, hexA }),
    [provider, dark, t, A, A2]
  );
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
