import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { Search, BookOpen, Users, FileText, Headphones, Quote, X } from 'lucide-react';
import { Link } from 'wouter';
import type { WritersFilter } from '@/types/writer';
import type { WritersStats } from '@/types/writer';

interface Props {
  filter: WritersFilter;
  suggestions: { slug: string; label: string; type: string }[];
  setFilter: (partial: Partial<WritersFilter>) => void;
  total: number;
  stats: WritersStats;
}

// ── Floating book-page particle ───────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  scale: 0.4 + Math.random() * 0.7,
  opacity: 0.04 + Math.random() * 0.10,
  speed: 6 + Math.random() * 14,
  drift: (Math.random() - 0.5) * 30,
  delay: Math.random() * -20,
  rotate: (Math.random() - 0.5) * 25,
}));

function BookParticle({ p }: { p: typeof PARTICLES[number] }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
      animate={{
        y: [0, -120, -240],
        x: [0, p.drift, p.drift * 0.5],
        rotate: [p.rotate, p.rotate + 8, p.rotate - 5],
        opacity: [0, p.opacity, 0],
      }}
      transition={{
        duration: p.speed,
        repeat: Infinity,
        delay: p.delay,
        ease: 'linear',
      }}
    >
      <svg
        width={Math.round(28 * p.scale)}
        height={Math.round(36 * p.scale)}
        viewBox="0 0 28 36"
        fill="none"
      >
        <rect x="1" y="1" width="26" height="34" rx="2" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.18" strokeWidth="0.8"/>
        <line x1="5" y1="8"  x2="23" y2="8"  stroke="white" strokeOpacity="0.3" strokeWidth="0.7"/>
        <line x1="5" y1="12" x2="23" y2="12" stroke="white" strokeOpacity="0.25" strokeWidth="0.6"/>
        <line x1="5" y1="16" x2="18" y2="16" stroke="white" strokeOpacity="0.2" strokeWidth="0.6"/>
        <line x1="5" y1="20" x2="21" y2="20" stroke="white" strokeOpacity="0.2" strokeWidth="0.6"/>
        <line x1="5" y1="24" x2="15" y2="24" stroke="white" strokeOpacity="0.15" strokeWidth="0.6"/>
      </svg>
    </motion.div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/6 border border-white/12 backdrop-blur-sm">
      <span className="text-violet-300">{icon}</span>
      <div>
        <div className="text-white font-bold text-lg leading-none">{value.toLocaleString()}</div>
        <div className="text-white/45 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WritersHero({ filter, suggestions, setFilter, total, stats }: Props) {
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

  const clearSearch = useCallback(() => {
    setFilter({ search: '' });
    setShowSuggestions(false);
  }, [setFilter]);

  return (
    <section className="relative w-full min-h-[560px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#06020f] via-[#130830] to-[#0b1035]">
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => <BookParticle key={p.id} p={p} />)}
      </div>

      {/* Ambient orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-700/18 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-800/10 rounded-full blur-[80px] pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center pt-24 pb-14">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/6 border border-white/15 backdrop-blur-sm mb-7"
        >
          <BookOpen className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white/85">Жазушылар энциклопедиясы</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-4 tracking-tight"
        >
          Қазақ жазушылары
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-lg md:text-xl text-white/55 max-w-xl mb-10"
        >
          Қазақ әдебиетінің көрнекті проза шеберлері
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="w-full max-w-2xl relative"
          ref={containerRef}
        >
          <div className="relative flex items-center px-5 py-2 rounded-2xl bg-white/8 border border-white/18 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-violet-500/50 focus-within:bg-white/10 transition-all duration-300">
            <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Жазушы аты, шығарма, жанр, туған жер..."
              className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-white/30 text-base"
              value={filter.search}
              onChange={(e) => {
                setFilter({ search: e.target.value });
                setShowSuggestions(true);
              }}
              onFocus={() => filter.search && setShowSuggestions(true)}
            />
            {filter.search && (
              <button onClick={clearSearch} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <X size={16} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/12 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50 overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <Link
                    key={i}
                    href={`/writers/${s.slug}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/8 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
                  >
                    <span className="text-sm">{s.label}</span>
                    <span className="text-xs text-violet-400 bg-violet-500/15 px-2.5 py-1 rounded-full">{s.type}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <StatPill icon={<Users size={17} />}    value={stats.totalWriters} label="Жазушылар" />
          <StatPill icon={<BookOpen size={17} />}  value={stats.totalWorks}   label="Шығармалар" />
          <StatPill icon={<FileText size={17} />}  value={stats.totalPdf}     label="PDF кітаптар" />
          <StatPill icon={<Headphones size={17} />} value={stats.totalAudio}   label="Аудиокітаптар" />
          <StatPill icon={<Quote size={17} />}     value={stats.totalQuotes}  label="Қанатты сөздер" />
        </motion.div>
      </div>
    </section>
  );
}
