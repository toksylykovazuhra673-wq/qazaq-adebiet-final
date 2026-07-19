import React from 'react';
import { User, Pen, Brain } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabAuthor({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Portrait */}
      <div className="flex gap-6 items-start">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 text-4xl"
          style={{ background: `linear-gradient(135deg, ${(analysis.coverGradient ?? ['#6d28d9','#1e1b4b'])[0]}, ${(analysis.coverGradient ?? ['#6d28d9','#1e1b4b'])[1]})` }}
        >
          <User size={40} className="text-white/80" />
        </div>
        <div>
          <h2 className="text-white text-2xl font-serif font-bold">{analysis.author}</h2>
          <p className="text-violet-300 text-sm">{analysis.period} · {analysis.genre}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Ақын', 'Философ', 'Жазушы', 'Ағартушы'].map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/60 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portrait description */}
      {analysis.authorPortrait && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Pen size={14} className="text-violet-400" />
            <h3 className="text-violet-300 text-sm font-semibold uppercase tracking-wide">Автордың шығармадағы бейнесі</h3>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{analysis.authorPortrait}</p>
        </div>
      )}

      {/* Literary theory - portrait & narration */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={14} className="text-blue-400" />
          <h3 className="text-blue-300 text-sm font-semibold uppercase tracking-wide">Портрет жасау шеберлігі</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Психологизм</p>
            <p className="text-white/80 text-sm leading-relaxed">{analysis.literaryTheory.psychology}</p>
          </div>
          <div className="h-px bg-white/8" />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Авторлық баяндау</p>
            <p className="text-white/80 text-sm leading-relaxed">{analysis.literaryTheory.narration}</p>
          </div>
          <div className="h-px bg-white/8" />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Портрет</p>
            <p className="text-white/80 text-sm leading-relaxed">{analysis.literaryTheory.portrait}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
