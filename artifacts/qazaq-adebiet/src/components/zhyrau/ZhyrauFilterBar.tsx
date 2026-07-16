import React from 'react';
import type { ZhyrauFilter, ZhyrauCenturyFilter, ZhyrauPeriodFilter, ZhyrauSortOption } from '@/types/zhyrau';

interface ZhyrauFilterBarProps {
  filter: ZhyrauFilter;
  setFilter: (partial: Partial<ZhyrauFilter>) => void;
  resetFilter: () => void;
  count: number;
}

const CENTURIES: { label: string; value: ZhyrauCenturyFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'XV', value: 'XV' },
  { label: 'XVI', value: 'XVI' },
  { label: 'XVII', value: 'XVII' },
  { label: 'XVIII', value: 'XVIII' },
  { label: 'XIX', value: 'XIX' },
];

const PERIODS: { label: string; value: ZhyrauPeriodFilter }[] = [
  { label: 'Барлығы', value: 'all' },
  { label: 'Ноғайлы дәуірі', value: 'Ноғайлы дәуірі' },
  { label: 'Қазақ хандығы', value: 'Қазақ хандығы' },
  { label: 'Жоңғар шапқыншылығы', value: 'Жоңғар шапқыншылығы' },
  { label: 'Абылай хан дәуірі', value: 'Абылай хан дәуірі' },
  { label: 'Тәуелсіздікке дейінгі зерттеулер', value: 'Тәуелсіздікке дейінгі зерттеулер' },
];

const SORTS: { label: string; value: ZhyrauSortOption }[] = [
  { label: 'Туған жылы', value: 'birthYear' },
  { label: 'Әліпби', value: 'alpha' },
  { label: 'Қаралым', value: 'viewCount' },
  { label: 'Танымал', value: 'popular' },
  { label: 'Жаңадан қосылған', value: 'addedDate' },
];

export default function ZhyrauFilterBar({ filter, setFilter, count }: ZhyrauFilterBarProps) {
  return (
    <div className="sticky top-16 z-30 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex-1 w-full overflow-x-auto pb-2 xl:pb-0 hide-scrollbar flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold mr-2">Ғасыр:</span>
            {CENTURIES.map((c) => (
              <button
                key={c.value}
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

          <div className="w-px h-8 bg-white/10 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold mr-2">Дәуір:</span>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilter({ period: p.value })}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  filter.period === p.value
                    ? 'bg-accent text-black border-accent shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-0 border-white/10 pt-4 xl:pt-0">
          <div className="text-sm font-medium text-white/60 shrink-0">
            <span className="text-white">{count}</span> жырау табылды
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-white/50 whitespace-nowrap">Сұрыптау:</span>
            <select
              value={filter.sort}
              onChange={(e) => setFilter({ sort: e.target.value as ZhyrauSortOption })}
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
