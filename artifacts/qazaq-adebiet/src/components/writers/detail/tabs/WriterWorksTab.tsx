import React from 'react';
import { BookOpen, Headphones, FileText } from 'lucide-react';
import type { Writer } from '@/types/writer';

export default function WriterWorksTab({ writer }: { writer: Writer }) {
  if (!writer.works || writer.works.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Шығармалар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="overflow-x-auto hide-scrollbar">
        {/* Desktop Table */}
        <table className="w-full text-left border-collapse min-w-[800px] hidden md:table">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 text-white/50 font-medium text-sm w-16 text-center">№</th>
              <th className="p-4 text-white/50 font-medium text-sm w-1/4">Атауы</th>
              <th className="p-4 text-white/50 font-medium text-sm w-24">Жылы</th>
              <th className="p-4 text-white/50 font-medium text-sm w-32">Жанры</th>
              <th className="p-4 text-white/50 font-medium text-sm">Сипаттамасы</th>
              <th className="p-4 text-white/50 font-medium text-sm w-48 text-right">Батырмалар</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {writer.works.map((work, idx) => (
              <tr key={work.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-center text-white/40">{idx + 1}</td>
                <td className="p-4 font-serif text-white font-medium">{work.title}</td>
                <td className="p-4 text-accent text-sm">{work.year}</td>
                <td className="p-4 text-white/70 text-sm">
                  <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/10 whitespace-nowrap">
                    {work.genre}
                  </span>
                </td>
                <td className="p-4 text-white/60 text-sm line-clamp-2 md:line-clamp-none">{work.description}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {work.hasRead && (
                      <button className="w-8 h-8 rounded-lg bg-primary/20 hover:bg-primary text-white flex items-center justify-center transition-colors" title="Оқу">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}
                    {work.hasPdf && (
                      <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="PDF">
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                    {work.hasAudio && (
                      <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Аудио">
                        <Headphones className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden flex flex-col divide-y divide-white/10">
          {writer.works.map((work, idx) => (
            <div key={work.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-sm">#{idx + 1}</span>
                  <h4 className="font-serif text-white text-lg font-medium">{work.title}</h4>
                </div>
                <span className="text-accent text-sm shrink-0">{work.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/10 text-white/70">
                  {work.genre}
                </span>
              </div>
              <p className="text-white/60 text-sm">{work.description}</p>
              
              <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                {work.hasRead && (
                  <button className="flex-1 py-1.5 rounded-lg bg-primary/20 hover:bg-primary text-white text-xs flex items-center justify-center gap-1 transition-colors">
                    <BookOpen className="w-3 h-3" /> Оқу
                  </button>
                )}
                {work.hasPdf && (
                  <button className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center gap-1 transition-colors">
                    <FileText className="w-3 h-3" /> PDF
                  </button>
                )}
                {work.hasAudio && (
                  <button className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center gap-1 transition-colors">
                    <Headphones className="w-3 h-3" /> Аудио
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}