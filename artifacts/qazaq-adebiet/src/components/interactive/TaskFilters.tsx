import { X } from 'lucide-react';
import type { TaskFilters } from '@/hooks/useTaskLab';

const TYPE_LABELS: Record<string, string> = {
  single_choice: 'Тест', multi_choice: 'Көп жауап', true_false: 'Дұрыс/Бұрыс',
  matching: 'Сәйкестендіру', drag_drop: 'Drag & Drop', fill_blank: 'Бос орын',
  ordering: 'Реттеу', memory_game: 'Жады ойыны', wheel_fortune: 'Дөңгелек', who_said: 'Кімнің сөзі',
};
const DIFF_LABELS: Record<string, string> = { easy: '🟢 Оңай', medium: '🟡 Орта', hard: '🔴 Қиын' };

interface Props {
  filters: TaskFilters;
  options: {
    authors: string[]; grades: string[]; genres: string[];
    centuries: string[]; topics: string[]; types: string[]; difficulties: string[];
  };
  onFilter: <K extends keyof TaskFilters>(key: K, val: TaskFilters[K]) => void;
  onClear: () => void;
  resultCount: number;
}

function FilterSelect({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none hover:border-white/20 transition-colors cursor-pointer"
    >
      <option value="" className="bg-slate-900">{label}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-slate-900">{o}</option>
      ))}
    </select>
  );
}

export default function TaskFilters({ filters, options, onFilter, onClear, resultCount }: Props) {
  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        <FilterSelect
          label="Автор" value={filters.author}
          options={options.authors} onChange={(v) => onFilter('author', v)}
        />
        <FilterSelect
          label="Сынып" value={filters.grade}
          options={options.grades} onChange={(v) => onFilter('grade', v)}
        />
        <FilterSelect
          label="Ғасыр" value={filters.century}
          options={options.centuries} onChange={(v) => onFilter('century', v)}
        />
        <FilterSelect
          label="Жанр" value={filters.genre}
          options={options.genres} onChange={(v) => onFilter('genre', v)}
        />
        <FilterSelect
          label="Тапсырма түрі" value={filters.type}
          options={options.types.map((t) => TYPE_LABELS[t] ?? t)}
          onChange={(v) => {
            const key = Object.entries(TYPE_LABELS).find(([, lbl]) => lbl === v)?.[0] ?? v;
            onFilter('type', key);
          }}
        />
        <FilterSelect
          label="Қиындық" value={filters.difficulty}
          options={options.difficulties.map((d) => DIFF_LABELS[d] ?? d)}
          onChange={(v) => {
            const key = Object.entries(DIFF_LABELS).find(([, lbl]) => lbl === v)?.[0] ?? v;
            onFilter('difficulty', key);
          }}
        />

        {hasActive && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm hover:bg-red-500/25 transition-colors"
          >
            <X size={14} />
            Тазарту
          </button>
        )}

        <span className="text-white/30 text-sm ml-auto">
          {resultCount} тапсырма табылды
        </span>
      </div>
    </div>
  );
}
