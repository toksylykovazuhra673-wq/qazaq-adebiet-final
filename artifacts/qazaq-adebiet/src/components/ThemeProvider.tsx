import {
  createContext, useContext, useState, useEffect,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: 'dark',
  toggle: () => {},
  setTheme: () => {},
});

const LS_KEY = 'qa-theme';

function resolveInitial(): Theme {
  try {
    const saved = localStorage.getItem(LS_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitial);

  const applyTheme = (t: Theme) => {
    const html = document.documentElement;
    if (t === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    try { localStorage.setItem(LS_KEY, t); } catch { /* ignore */ }
  };

  // Apply on mount and whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Apply immediately on mount to avoid flash
  useEffect(() => {
    applyTheme(resolveInitial());
  }, []);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState(t => (t === 'dark' ? 'light' : 'dark'));

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}

// ── Theme Toggle Button ───────────────────────────────────────────────────────
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Жарық режимге ауысу' : 'Қараңғы режимге ауысу'}
      className={`relative p-2 rounded-xl text-muted-foreground hover:text-foreground
        hover:bg-white/5 transition-all ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun size={17} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon size={17} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
