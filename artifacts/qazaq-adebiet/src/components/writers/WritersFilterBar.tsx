import React from 'react';
import type { WritersFilter, WriterCenturyFilter, WriterMovementFilter, WriterGenreFilter, WriterSortOption } from '@/types/writer';

interface WritersFilterBarProps {
  filter: WritersFilter;
  setFilter: (partial: Partial<WritersFilter>) => void;
  resetFilter: () => void;
  count: number;
}

const CENTURIES: { label: string; value: WriterCenturyFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'XIX', value: 'XIX' },
  { label: 'XX', value: 'XX' },
  { label: 'XXI', value: 'XXI' },
];

const MOVEMENTS: { label: string; value: WriterMovementFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'Алаш', value: 'Алаш' },
  { label: 'Классикалық әдебиет', value: 'Классикалық әдебиет' },
  { label: 'Кеңес дәуірі', value: 'Кеңес дәуірі' },
  { label: 'Тәуелсіздік кезеңі', value: 'Тәуелсіздік кезеңі' },
];

const GENRES: { label: string; value: WriterGenreFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'Роман', value: 'Роман' },
  { label: 'Повесть', value: 'Повесть' },
  { label: 'Әңгіме', value: 'Әңгіме' },
  { label: 'Пьеса', value: 'Пьеса' },
  { label: 'Эссе', value: 'Эссе' },
  { label: 'Балалар әдебиеті', value: 'Балалар әдебиеті' },
  { label: 'Тарихи шығарма', value: 'Тарихи шығарма' },
];

const SORTS: { label: string; value: WriterSortOption }[] = [
  { label: 'Әліпби', value: 'alpha' },
  { label: 'Туған жылы', value: 'birthYear' },
  { label: 'Қаралым', value: 'viewCount' },
  { label: 'Ең танымал', value: 'popular' },
  { label: 'Жаңадан қосылған', value: 'addedDate' },
];

export default function WritersFilterBar({ filter, setFilter, count }: WritersFilterBarProps) {
  return (
    <div className="sticky top-16 z-30 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        
        {/* Left Side: Chips */}
        <div className="flex-1 w-full overflow-x-auto pb-2 xl:pb-0 hide-scrollbar flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold mr-2">Ғасыр:</span>
            {CENTURIES.map((c) => (
              <button
                key={`c-${c.value}`}
                onClick={() => setFilter({ century: c.value })}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  filter.century === c.value
                    ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-white/10 shrink-0 hidden sm:block"></div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold mr-2">Бағыт:</span>
            {MOVEMENTS.map((m) => (
              <button
                key={`m-${m.value}`}
                onClick={() => setFilter({ movement: m.value })}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  filter.movement === m.value
                    ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          
          <div className="w-px h-8 bg-white/10 shrink-0 hidden sm:block"></div>
          
          <div className="flex items-center gap-2 shrink-0 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold mr-2">Жанр:</span>
            {GENRES.map((g) => (
              <button
                key={`g-${g.value}`}
                onClick={() => setFilter({ genre: g.value })}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  filter.genre === g.value
                    ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Results & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-0 border-white/10 pt-4 xl:pt-0">
          <div className="text-sm font-medium text-white/60 shrink-0">
            <span className="text-white">{count}</span> жазушы табылды
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-white/50 whitespace-nowrap">Сұрыптау:</span>
            <select
              value={filter.sort}
              onChange={(e) => setFilter({ sort: e.target.value as WriterSortOption })}
              className="bg-black/50 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-auto appearance-none cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#0a0618] text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}