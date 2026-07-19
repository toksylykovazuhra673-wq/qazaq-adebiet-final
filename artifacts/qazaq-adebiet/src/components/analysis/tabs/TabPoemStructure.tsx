import React from 'react';
import { Music2 } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabPoemStructure({ analysis }: { analysis: Analysis }) {
  if (!analysis.poemStructure) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Music2 size={32} className="text-white/20" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-3">Өлең құрылысы талданбайды</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          «{analysis.title}» шығармасы <strong className="text-white/70">{analysis.genre}</strong> жанрында
          жазылған — бұл проза немесе мәтін; өлең өлшемі, ұйқас сызбасы, буын саны сияқты
          поэтикалық элементтер осы шығармаға тән емес.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm">
          <Music2 size={14} /> Тек өлең жанрындағы шығармаларға қолданылады
        </div>
      </div>
    );
  }

  // If poemStructure data exists (for future poems)
  const ps = analysis.poemStructure as Record<string, string>;
  return (
    <div className="space-y-4 max-w-2xl">
      {Object.entries(ps).map(([key, value]) => (
        <div key={key} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{key}</p>
          <p className="text-white text-sm">{value}</p>
        </div>
      ))}
    </div>
  );
}
