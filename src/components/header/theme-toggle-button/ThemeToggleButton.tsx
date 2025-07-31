import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../hooks/theme';
import classes from './ThemeToggleButton.module.scss';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={classes.themeToggleButton}
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
