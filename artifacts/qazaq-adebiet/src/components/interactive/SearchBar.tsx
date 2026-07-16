import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '@/types/task';

interface Props {
  value: string;
  onChange: (v: string) => void;
  allTasks: Task[];
  onSelect: (task: Task) => void;
}

export default function SearchBar({ value, onChange, allTasks, onSelect }: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = value.length >= 2
    ? allTasks
        .filter((t) =>
          `${t.title} ${t.author} ${t.work} ${t.topic}`.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const TYPE_ICONS: Record<string, string> = {
    single_choice: '🔘', multi_choice: '☑️', true_false: '✅',
    matching: '🔗', drag_drop: '🖱️', fill_blank: '✏️',
    ordering: '📋', memory_game: '🃏', wheel_fortune: '🎡', who_said: '💬',
  };

  return (
    <div className="relative mb-6">
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white/5 backdrop-blur-sm px-4 py-3.5 transition-all duration-200 ${
          focused ? 'border-violet-500/60 shadow-lg shadow-violet-900/20' : 'border-white/10'
        }`}
      >
        <Search size={18} className="text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Тапсырма, автор, шығарма іздеңіз... (/ пернесі)"
          className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-sm"
        />
        {value && (
          <button onClick={() => onChange('')} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
        <kbd className="hidden md:flex px-2 py-0.5 rounded border border-white/10 text-white/25 text-xs">/</kbd>
      </div>

      {/* autocomplete dropdown */}
      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-sm overflow-hidden shadow-xl"
          >
            {suggestions.map((task) => (
              <button
                key={task.id}
                onMouseDown={() => { onSelect(task); onChange(''); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-lg">{TYPE_ICONS[task.type] ?? '📝'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{task.title}</div>
                  <div className="text-white/40 text-xs truncate">{task.author} · {task.topic}</div>
                </div>
                <span className="text-white/25 text-xs flex-shrink-0">{task.points} XP</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
