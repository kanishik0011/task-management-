'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeName = 'daylight' | 'midnight' | 'sage';

const THEME_KEY = 'assessment_theme';
const DEFAULT_THEME: ThemeName = 'daylight';

const ThemeContext = createContext<{
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (isThemeName(storedTheme)) {
      setThemeState(storedTheme);
      document.documentElement.dataset.theme = storedTheme;
    } else {
      document.documentElement.dataset.theme = DEFAULT_THEME;
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: ThemeName) => {
        setThemeState(nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        window.localStorage.setItem(THEME_KEY, nextTheme);
      }
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}

function isThemeName(value: string | null): value is ThemeName {
  return value === 'daylight' || value === 'midnight' || value === 'sage';
}
