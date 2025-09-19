import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { Theme } from '../../App';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  return (
    <div className="flex items-center border border-border rounded-md p-0.5">
       <button 
        onClick={() => setTheme('light')}
        className={`p-1 rounded-sm transition-colors ${theme === 'light' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
        aria-label="Switch to light mode"
      >
        <SunIcon className="w-4 h-4" />
      </button>
       <button 
        onClick={() => setTheme('dark')}
        className={`p-1 rounded-sm transition-colors ${theme === 'dark' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
        aria-label="Switch to dark mode"
      >
        <MoonIcon className="w-4 h-4" />
      </button>
    </div>
  );
};