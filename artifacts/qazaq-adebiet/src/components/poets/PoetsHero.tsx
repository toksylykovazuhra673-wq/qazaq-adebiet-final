import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Users } from 'lucide-react';
import type { PoetsFilter } from '@/types/poet';

interface PoetsHeroProps {
  filter: PoetsFilter;
  suggestions: { slug: string; label: string }[];
  setFilter: (partial: Partial<PoetsFilter>) => void;
  total: number;
}

export default function PoetsHero({ filter, suggestions, setFilter, total }: PoetsHeroProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative w-full min-h-[420px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0520] via-[#1a0540] to-[#0d1840] pt-20">
      {/* Decorative Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-6"
        >
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white/90">Ақындар энциклопедиясы</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-6"
        >
          Ақындар энциклопедиясы
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mb-10"
        >
          Қазақ әдебиетіндегі ақындардың өмірі, шығармашылығы және әдеби мұрасы.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl relative"
          ref={containerRef}
        >
          <div className="relative glass-panel rounded-full overflow-hidden flex items-center px-4 py-2 ring-1 ring-white/20 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
            <Search className="w-6 h-6 text-white/50 flex-shrink-0" />
            <input
              type="text"
              placeholder="Ақынның атын немесе шығармасын іздеңіз..."
              className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-white/40"
              value={filter.search}
              onChange={(e) => {
                setFilter({ search: e.target.value });
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden shadow-2xl z-50 py-2 border border-white/10"
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={s.slug}
                    className="w-full text-left px-6 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                    onClick={() => {
                      setFilter({ search: s.label });
                      setShowSuggestions(false);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70">
            <Users className="w-4 h-4 text-accent" />
            <span>{total} ақын</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
