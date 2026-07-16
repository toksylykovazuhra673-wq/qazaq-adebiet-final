import React, { useState, useRef, useEffect } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import type { EducatorFilter } from '@/types/educator';

interface Props {
  filter: EducatorFilter;
  suggestions: { slug: string; label: string }[];
  setFilter: (p: Partial<EducatorFilter>) => void;
  total: number;
}

export default function EducatorHero({ filter, suggestions, setFilter, total }: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0d0820] via-[#0f0c25] to-[#0a0618] py-20 lg:py-28">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-700/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-teal-600/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/5 w-[300px] h-[300px] bg-amber-600/6 blur-[80px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-sm font-medium">
            <GraduationCap className="w-4 h-4" />
            Ағартушылар энциклопедиясы
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-4 leading-tight"
        >
          Қазақ{' '}
          <span className="bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
            ағартушылары
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Қазақ ағартушыларының өмірі, ғылыми-педагогикалық қызметі, еңбектері және рухани мұрасы.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-2xl mx-auto"
        >
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-200 ${
              focused
                ? 'bg-white/8 border-violet-500/60 shadow-lg shadow-violet-500/10'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <Search className="w-5 h-5 text-white/40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Аты, мамандығы, еңбегі немесе кілт сөзімен іздеңіз..."
              className="flex-1 bg-transparent text-white placeholder-white/30 text-base outline-none"
            />
            {filter.search && (
              <button
                onClick={() => setFilter({ search: '' })}
                className="text-white/40 hover:text-white transition-colors text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete */}
          <AnimatePresence>
            {focused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#12082e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                {suggestions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/educators/${s.slug}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-violet-400/60" />
                    <span className="text-white text-sm">{s.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Count badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            <GraduationCap className="w-4 h-4 text-violet-400" />
            {total} ағартушы
          </span>
        </motion.div>
      </div>
    </div>
  );
}
