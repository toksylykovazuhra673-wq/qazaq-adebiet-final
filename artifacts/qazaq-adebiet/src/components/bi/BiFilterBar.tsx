import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { BiFilter, BiCenturyFilter, BiPeriodFilter, BiSortOption } from '@/types/bi';

interface Props {
  filter: BiFilter;
  setFilter: (p: Partial<BiFilter>) => void;
  resetFilter: () => void;
  count: number;
}

const CENTURIES: { value: BiCenturyFilter; label: string }[] = [
  { value: 'all', label: 'Барлығы' },
  { value: 'XIII', label: 'XIII' },
  { value: 'XIV', label: 'XIV' },
  { value: 'XV', label: 'XV' },
  { value: 'XVI', label: 'XVI' },
  { value: 'XVII', label: 'XVII' },
  { value: 'XVIII', label: 'XVIII' },
  { value: 'XIX', label: 'XIX' },
];

const PERIODS: { value: BiPeriodFilter; label: string }[] = [
  { value: 'all', label: 'Барлығы' },
  { value: 'Үш би дәуірі', label: 'Үш би' },
  { value: 'Қазақ хандығы', label: 'Қазақ хандығы' },
  { value: 'Жоңғар шапқыншылығы', label: 'Жоңғар' },
  { value: 'Аңырақай шайқасы', label: 'Аңырақай' },
  { value: 'Ресей отаршылдығы', label: 'Ресей дәуірі' },
];

const SORTS: { value: BiSortOption; label: string }[] = [
  { value: 'birthYear', label: 'Туған жылы' },
  { value: 'alpha', label: 'Әліпби' },
  { value: 'viewCount', label: 'Қаралым' },
  { value: 'popular', label: 'Танымал' },
  { value: 'addedDate', label: 'Жаңа' },
];

export default function BiFilterBar({ filter, setFilter, resetFilter, count }: Props) {
  const isFiltered =
    filter.century !== 'all' || filter.period !== 'all' || filter.search !== '';

  return (
    <div className="sticky top-[64px] z-30 bg-[#0a0618]/95 backdrop-blur-xl border-b border-white/8">
      <div className="container mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        {/* Century */}
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider shrink-0">
            ҒАСЫР:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {CENTURIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter({ century: c.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter.century === c.value
                    ? 'bg-teal-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/10" />

        {/* Period */}
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider shrink-0">
            ДӘУІР:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilter({ period: p.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  filter.period === p.value
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Count */}
        <span className="text-white/40 text-xs shrink-0">
          <span className="text-white font-semibold">{count}</span> би-шешен табылды
        </span>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
          <select
            value={filter.sort}
            onChange={(e) => setFilter({ sort: e.target.value as BiSortOption })}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-teal-500/50 cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#0f0a22]">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {isFiltered && (
          <button
            onClick={resetFilter}
            className="text-xs text-teal-400 hover:text-teal-300 transition-colors shrink-0"
          >
            Тазалау ✕
          </button>
        )}
      </div>
    </div>
  );
}
