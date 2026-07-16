import React from 'react';
import type { PoetsFilter, CenturyFilter, MovementFilter, SortOption } from '@/types/poet';

interface PoetsFilterBarProps {
  filter: PoetsFilter;
  setFilter: (partial: Partial<PoetsFilter>) => void;
  resetFilter: () => void;
  count: number;
}

const CENTURIES: { label: string; value: CenturyFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'XV', value: 'XV' },
  { label: 'XVI', value: 'XVI' },
  { label: 'XVII', value: 'XVII' },
  { label: 'XVIII', value: 'XVIII' },
  { label: 'XIX', value: 'XIX' },
  { label: 'XX', value: 'XX' },
  { label: 'XXI', value: 'XXI' },
];

const MOVEMENTS: { label: string; value: MovementFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'Алаш', value: 'Алаш' },
  { label: 'Зар заман', value: 'Зар заман' },
  { label: 'Халық ақындары', value: 'Халық ақындары' },
  { label: 'Қазіргі поэзия', value: 'Қазіргі поэзия' },
  { label: 'Ағартушылық', value: 'Ағартушылық' },
];

const SORTS: { label: string; value: SortOption }[] = [
  { label: 'Әліпби', value: 'alpha' },
  { label: 'Туған жылы', value: 'birthYear' },
  { label: 'Танымал', value: 'popular' },
  { label: 'Қаралым', value: 'viewCount' },
  { label: 'Жаңа', value: 'addedDate' },
];

export default function PoetsFilterBar({ filter, setFilter, count }: PoetsFilterBarProps) {
  return (
    <div className="sticky top-16 z-30 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col xl:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Chips */}
        <div className="flex-1 w-full overflow-x-auto pb-2 xl:pb-0 hide-scrollbar flex items-center gap-6">
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

          <div className="w-px h-8 bg-white/10 shrink-0 hidden md:block"></div>

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
        </div>

        {/* Right Side: Results & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full xl:w-auto justify-between xl:justify-end">
          <div className="text-sm font-medium text-white/60 shrink-0">
            <span className="text-white">{count}</span> ақын табылды
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-white/50 whitespace-nowrap">Сұрыптау:</span>
            <select
              value={filter.sort}
              onChange={(e) => setFilter({ sort: e.target.value as SortOption })}
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
