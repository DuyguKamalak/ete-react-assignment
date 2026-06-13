import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const THEME_KEY = 'ete_theme';
const ThemeModeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem(THEME_KEY) as ThemeMode) || 'light'
  );

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeModeProvider');
  return ctx;
}
