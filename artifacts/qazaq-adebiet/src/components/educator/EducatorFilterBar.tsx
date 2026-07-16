import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type {
  EducatorFilter,
  EducatorCentury,
  EducatorProfessionFilter,
  EducatorSortOption,
} from '@/types/educator';

interface Props {
  filter: EducatorFilter;
  setFilter: (p: Partial<EducatorFilter>) => void;
  resetFilter: () => void;
  count: number;
}

const CENTURIES: { value: 'all' | EducatorCentury; label: string }[] = [
  { value: 'all', label: 'Барлығы' },
  { value: 'XIX', label: 'XIX' },
  { value: 'XX', label: 'XX' },
  { value: 'XXI', label: 'XXI' },
];

const PROFESSIONS: { value: EducatorProfessionFilter; label: string }[] = [
  { value: 'all', label: 'Барлығы' },
  { value: 'Педагог', label: 'Педагог' },
  { value: 'Ғалым', label: 'Ғалым' },
  { value: 'Лингвист', label: 'Лингвист' },
  { value: 'Тарихшы', label: 'Тарихшы' },
  { value: 'Фольклортанушы', label: 'Фольклортанушы' },
  { value: 'Ақын', label: 'Ақын' },
  { value: 'Жазушы', label: 'Жазушы' },
  { value: 'Қоғам қайраткері', label: 'Қоғам қайраткері' },
];

const SORTS: { value: EducatorSortOption; label: string }[] = [
  { value: 'birthYear', label: 'Туған жылы' },
  { value: 'alpha', label: 'Əліпби' },
  { value: 'viewCount', label: 'Қаралым' },
  { value: 'popular', label: 'Танымал' },
];

export default function EducatorFilterBar({
  filter,
  setFilter,
  resetFilter,
  count,
}: Props) {
  const isFiltered =
    filter.century !== 'all' || filter.profession !== 'all' || filter.search !== '';

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
                    ? 'bg-violet-500 text-white'
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

        {/* Profession */}
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider shrink-0">
            ҚЫЗМЕТ:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {PROFESSIONS.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilter({ profession: p.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  filter.profession === p.value
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
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
          <span className="text-white font-semibold">{count}</span> ағартушы табылды
        </span>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
          <select
            value={filter.sort}
            onChange={(e) => setFilter({ sort: e.target.value as EducatorSortOption })}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-violet-500/50 cursor-pointer"
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
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors shrink-0"
          >
            Тазалау ✕
          </button>
        )}
      </div>
    </div>
  );
}
