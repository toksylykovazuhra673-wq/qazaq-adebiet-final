import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WritersFilter, WriterCenturyFilter, WriterMovementFilter, WriterGenreFilter, WriterSortOption, WriterSpecialFilter } from '@/types/writer';

interface Props {
  filter: WritersFilter;
  setFilter: (partial: Partial<WritersFilter>) => void;
  resetFilter: () => void;
  count: number;
  alphabetLetters: string[];
  hasActiveFilters: boolean;
}

const CENTURIES: { label: string; value: WriterCenturyFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'XIX ғ.', value: 'XIX' },
  { label: 'XX ғ.',  value: 'XX' },
  { label: 'XXI ғ.', value: 'XXI' },
];
const MOVEMENTS: { label: string; value: WriterMovementFilter }[] = [
  { label: 'Барлығы',            value: 'all' },
  { label: 'Алаш',              value: 'Алаш' },
  { label: 'Классикалық',       value: 'Классикалық әдебиет' },
  { label: 'Кеңес дәуірі',      value: 'Кеңес дәуірі' },
  { label: 'Тәуелсіздік',       value: 'Тәуелсіздік кезеңі' },
];
const GENRES: { label: string; value: WriterGenreFilter }[] = [
  { label: 'Барлығы',       value: 'all' },
  { label: 'Роман',         value: 'Роман' },
  { label: 'Повесть',       value: 'Повесть' },
  { label: 'Әңгіме',        value: 'Әңгіме' },
  { label: 'Пьеса',         value: 'Пьеса' },
  { label: 'Эссе',          value: 'Эссе' },
  { label: 'Балалар',       value: 'Балалар әдебиеті' },
  { label: 'Тарихи',        value: 'Тарихи шығарма' },
];
const SORTS: { label: string; value: WriterSortOption }[] = [
  { label: 'Әліпби',          value: 'alpha' },
  { label: 'Туған жылы',      value: 'birthYear' },
  { label: 'Қаралым',         value: 'viewCount' },
  { label: 'Ең танымал',      value: 'popular' },
  { label: 'Жаңадан қосылған', value: 'addedDate' },
];
const SPECIALS: { label: string; value: WriterSpecialFilter; emoji: string }[] = [
  { label: 'Барлығы',         value: 'all',        emoji: '🌐' },
  { label: 'Алаш қайраткері', value: 'alash',      emoji: '🦅' },
  { label: 'Кеңес дәуірі',    value: 'soviet',     emoji: '⭐' },
  { label: 'Балалар',         value: 'children',   emoji: '🌱' },
  { label: 'Драматург',       value: 'drama',      emoji: '🎭' },
  { label: 'Ақын-жазушы',     value: 'poet-writer',emoji: '✍️' },
  { label: 'Таңдаулы',        value: 'featured',   emoji: '💎' },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
        active
          ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export default function WritersFilterBar({ filter, setFilter, resetFilter, count, alphabetLetters, hasActiveFilters }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ── Sticky bar ────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/8 shadow-xl">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center gap-3">

          {/* Filter drawer button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              hasActiveFilters
                ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'bg-white/5 border-white/12 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={15} />
            Фильтр
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />}
          </button>

          {/* Century chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {CENTURIES.map((c) => (
              <Chip key={c.value} active={filter.century === c.value} onClick={() => setFilter({ century: c.value })}>
                {c.label}
              </Chip>
            ))}
          </div>

          <div className="w-px h-5 bg-white/10 hidden sm:block" />

          {/* Sort */}
          <div className="relative ml-auto flex items-center gap-2">
            <span className="text-xs text-white/35 whitespace-nowrap hidden md:block">Сұрыптау:</span>
            <div className="relative">
              <select
                value={filter.sort}
                onChange={(e) => setFilter({ sort: e.target.value as WriterSortOption })}
                className="appearance-none bg-white/5 border border-white/12 text-white text-xs rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:border-violet-500/50 cursor-pointer"
              >
                {SORTS.map((s) => <option key={s.value} value={s.value} className="bg-slate-900">{s.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Count */}
          <div className="text-xs text-white/40 whitespace-nowrap">
            <span className="text-white font-semibold">{count}</span> нәтиже
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button onClick={resetFilter} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/12 border border-red-500/25 text-red-400 text-xs hover:bg-red-500/20 transition-all">
              <X size={12} /> Тазарту
            </button>
          )}
        </div>

        {/* Alphabet bar */}
        {alphabetLetters.length > 0 && (
          <div className="border-t border-white/6 overflow-x-auto hide-scrollbar">
            <div className="flex px-4 lg:px-8 py-2 gap-1.5 w-max">
              <button
                onClick={() => setFilter({ alphabet: '' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!filter.alphabet ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/8'}`}
              >
                Барлығы
              </button>
              {alphabetLetters.map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter({ alphabet: filter.alphabet === l ? '' : l })}
                  className={`w-8 h-7 rounded-lg text-xs font-semibold transition-all ${filter.alphabet === l ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white hover:bg-white/8'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Filter Drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-slate-900 border-l border-white/10 z-50 overflow-y-auto shadow-2xl"
            >
              {/* Drawer header */}
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-violet-400" />
                  <h3 className="text-white font-bold">Кеңейтілген фильтр</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl hover:bg-white/8 text-white/50 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-7">

                {/* Search */}
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Іздеу</label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/6 border border-white/12 focus-within:border-violet-500/50 transition-all">
                    <Search size={15} className="text-white/30" />
                    <input
                      type="text"
                      placeholder="Жазушы, шығарма, жанр..."
                      value={filter.search}
                      onChange={(e) => setFilter({ search: e.target.value })}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/25 outline-none"
                    />
                  </div>
                </div>

                {/* Special filter */}
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 block">Санат</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setFilter({ specialFilter: s.value })}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                          filter.specialFilter === s.value
                            ? 'bg-violet-600 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {s.emoji} {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Century */}
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 block">Ғасыр</label>
                  <div className="flex flex-wrap gap-2">
                    {CENTURIES.map((c) => (
                      <Chip key={c.value} active={filter.century === c.value} onClick={() => setFilter({ century: c.value })}>
                        {c.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Literary movement */}
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 block">Әдеби бағыт</label>
                  <div className="flex flex-wrap gap-2">
                    {MOVEMENTS.map((m) => (
                      <Chip key={m.value} active={filter.movement === m.value} onClick={() => setFilter({ movement: m.value })}>
                        {m.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 block">Жанр</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => (
                      <Chip key={g.value} active={filter.genre === g.value} onClick={() => setFilter({ genre: g.value })}>
                        {g.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 block">Сұрыптау</label>
                  <div className="flex flex-wrap gap-2">
                    {SORTS.map((s) => (
                      <Chip key={s.value} active={filter.sort === s.value} onClick={() => setFilter({ sort: s.value })}>
                        {s.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                {hasActiveFilters && (
                  <button onClick={() => { resetFilter(); setDrawerOpen(false); }}
                    className="w-full py-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-all">
                    Барлық фильтрді тазарту
                  </button>
                )}

                <button onClick={() => setDrawerOpen(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm transition-all">
                  Нәтижені көру
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
