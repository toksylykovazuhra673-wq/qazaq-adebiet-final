import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App';
import './index.css';

// Apply theme class immediately to avoid flash
(function applyThemeEarly() {
  try {
    const saved = localStorage.getItem('qa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch { /* localStorage unavailable (private mode etc.) — default to dark */ 
    document.documentElement.classList.add('dark');
  }
})();

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
