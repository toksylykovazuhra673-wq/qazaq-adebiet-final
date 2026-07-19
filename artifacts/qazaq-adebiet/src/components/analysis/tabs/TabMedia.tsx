import React from 'react';
import { FileText, Headphones, Film, ExternalLink } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

function MediaCard({
  icon, title, label, available, href,
}: {
  icon: React.ReactNode; title: string; label: string; available: boolean; href?: string;
}) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 ${
      available ? 'bg-white/[0.04] border-white/12' : 'bg-white/[0.02] border-white/6 opacity-60'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${available ? 'bg-violet-500/20' : 'bg-white/5'}`}>
          {icon}
        </div>
        <div>
          <p className="text-white font-semibold">{title}</p>
          <p className="text-white/40 text-sm">{label}</p>
        </div>
      </div>
      {available && href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 justify-center py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-medium text-sm transition-colors"
        >
          <ExternalLink size={14} /> Ашу
        </a>
      ) : (
        <div className="py-2.5 rounded-xl bg-white/5 border border-white/8 text-center text-white/30 text-sm">
          Жақын арада қосылады
        </div>
      )}
    </div>
  );
}

export default function TabMedia({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-6">
      <p className="text-white/40 text-sm">
        «{analysis.title}» шығармасының медиа нұсқалары
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MediaCard
          icon={<FileText size={24} className="text-blue-400" />}
          title="PDF нұсқасы"
          label="Толық мәтін"
          available={false}
        />
        <MediaCard
          icon={<Headphones size={24} className="text-amber-400" />}
          title="Аудиокітап"
          label="Дауыстап оқылған"
          available={false}
        />
        <MediaCard
          icon={<Film size={24} className="text-red-400" />}
          title="Бейне талдау"
          label="Видеосабақ"
          available={false}
        />
      </div>

      {/* Reader link if available */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-emerald-300 font-semibold">Онлайн оқу қол жетімді</p>
          <p className="text-white/50 text-sm mt-0.5">Мәтінді платформада тікелей оқуға болады</p>
        </div>
        <a
          href={`/reader/${analysis.workSlug}`}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-medium text-sm transition-colors"
        >
          Оқу <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
