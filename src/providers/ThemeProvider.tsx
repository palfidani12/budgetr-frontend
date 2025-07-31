import { type ReactNode, useEffect, useState } from 'react';
import { type Theme, ThemeContext } from '../context/theme.context';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeInLocalStorage = localStorage.getItem('budgetr-theme') as 'light' | 'dark' | undefined;
  const [theme, setTheme] = useState<Theme>(themeInLocalStorage ?? 'light');

  useEffect(() => {
    localStorage.setItem('budgetr-theme', theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
