import React from 'react';
import { AlignLeft } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabSummary({ analysis }: { analysis: Analysis }) {
  if (!analysis.summary) {
    return (
      <div className="text-center py-16 text-white/40">
        <AlignLeft size={40} className="mx-auto mb-4 opacity-30" />
        <p>Қысқаша мазмұн әзірге қол жетімсіз.</p>
      </div>
    );
  }

  // Split summary into paragraphs
  const paragraphs = analysis.summary.split('\n').filter(Boolean);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
        <div>
          <h2 className="text-white font-bold text-xl">{analysis.title}</h2>
          <p className="text-white/50 text-sm">{analysis.author} · {analysis.period}</p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-4">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-white/80 text-base leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Word cloud */}
      {analysis.keyWords && analysis.keyWords.length > 0 && (
        <div>
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">Кілт сөздер</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keyWords.slice(0, 12).map(({ word, count }) => (
              <span
                key={word}
                className="px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm"
                title={`${count} рет`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
