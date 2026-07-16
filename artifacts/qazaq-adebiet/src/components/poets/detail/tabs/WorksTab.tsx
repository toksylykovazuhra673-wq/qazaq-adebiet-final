import React from 'react';
import { BookOpen, FileText, Headphones, ExternalLink } from 'lucide-react';
import type { Poet } from '@/types/poet';

export default function WorksTab({ poet }: { poet: Poet }) {
  if (!poet.works || poet.works.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Шығармалар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium w-16 text-center">№</th>
              <th className="p-4 font-medium">Атауы</th>
              <th className="p-4 font-medium w-24">Жылы</th>
              <th className="p-4 font-medium w-32">Жанр</th>
              <th className="p-4 font-medium">Сипаттамасы</th>
              <th className="p-4 font-medium w-48">Қолжетімділік</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {poet.works.map((work, idx) => (
              <tr key={work.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-center text-white/40">{idx + 1}</td>
                <td className="p-4 font-medium text-white">{work.title}</td>
                <td className="p-4 text-accent">{work.year}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-white/5 rounded text-xs text-white/70 whitespace-nowrap">
                    {work.genre}
                  </span>
                </td>
                <td className="p-4 text-white/60 text-sm truncate max-w-[200px]" title={work.description}>
                  {work.description}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      disabled={!work.hasRead}
                      className={`p-2 rounded-lg transition-colors ${
                        work.hasRead 
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      title="Оқу"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={!work.hasPdf}
                      className={`p-2 rounded-lg transition-colors ${
                        work.hasPdf 
                          ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      title="PDF форматы"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={!work.hasAudio}
                      className={`p-2 rounded-lg transition-colors ${
                        work.hasAudio 
                          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      title="Аудио нұсқа"
                    >
                      <Headphones className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {poet.works.map((work, idx) => (
          <div key={work.id} className="glass-card rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white text-lg">{idx + 1}. {work.title}</h4>
              <span className="text-accent text-sm">{work.year}</span>
            </div>
            <div className="mb-3">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                {work.genre}
              </span>
            </div>
            <p className="text-sm text-white/60 mb-4">{work.description}</p>
            <div className="flex items-center gap-2 border-t border-white/10 pt-3">
              {work.hasRead && (
                <button className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">
                  <BookOpen className="w-4 h-4" /> Оқу
                </button>
              )}
              {work.hasPdf && (
                <button className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                  <FileText className="w-4 h-4" /> PDF
                </button>
              )}
              {work.hasAudio && (
                <button className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium">
                  <Headphones className="w-4 h-4" /> Аудио
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
