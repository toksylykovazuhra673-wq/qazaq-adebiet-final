import React from 'react';
import { BookOpen, FileText, Headphones, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import type { Poet } from '@/types/poet';
import booksJson from '@/data/books.json';

const BOOK_SLUGS = new Set((booksJson as { slug: string }[]).map(b => b.slug));

// Derive a reader slug from readerSlug field or work title slug
function getReaderSlug(work: { readerSlug?: string; title: string }): string | undefined {
  if (work.readerSlug) return work.readerSlug;
  return undefined;
}

export default function WorksTab({ poet }: { poet: Poet }) {
  const [, navigate] = useLocation();

  if (!poet.works || poet.works.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Шығармалар тізімі әзірге бос.</p>
      </div>
    );
  }

  const handleRead = (readerSlug?: string) => {
    if (readerSlug && BOOK_SLUGS.has(readerSlug)) {
      navigate(`/reader/${readerSlug}`);
    }
  };

  const handleAnalysis = (readerSlug?: string) => {
    if (readerSlug) {
      navigate(`/analysis/${readerSlug}`);
    } else {
      navigate('/taldau');
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium w-12 text-center">№</th>
              <th className="p-4 font-medium">Атауы</th>
              <th className="p-4 font-medium w-20">Жылы</th>
              <th className="p-4 font-medium w-32">Жанр</th>
              <th className="p-4 font-medium">Сипаттамасы</th>
              <th className="p-4 font-medium w-52">Қолжетімділік</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {poet.works.map((work, idx) => {
              const rSlug = getReaderSlug(work);
              const canRead = work.hasRead && rSlug && BOOK_SLUGS.has(rSlug);
              return (
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
                    <div className="flex gap-1.5">
                      {/* Read */}
                      <button
                        onClick={() => canRead ? handleRead(rSlug) : undefined}
                        disabled={!canRead}
                        title={canRead ? 'Онлайн оқу' : 'Мәтін жоқ'}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          canRead
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {canRead ? 'Оқу' : 'Оқу'}
                      </button>

                      {/* PDF */}
                      <button
                        disabled={!work.hasPdf}
                        title={work.hasPdf ? 'PDF форматы' : 'PDF жоқ'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          work.hasPdf
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      {/* Audio */}
                      <button
                        disabled={!work.hasAudio}
                        title={work.hasAudio ? 'Аудио нұсқа' : 'Аудио жоқ'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          work.hasAudio
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        <Headphones className="w-3.5 h-3.5" />
                      </button>

                      {/* Analysis */}
                      <button
                        onClick={() => handleAnalysis(rSlug)}
                        title="Талдау"
                        className="p-1.5 rounded-lg bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {poet.works.map((work, idx) => {
          const rSlug = getReaderSlug(work);
          const canRead = work.hasRead && rSlug && BOOK_SLUGS.has(rSlug);
          return (
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
                {canRead && (
                  <button
                    onClick={() => handleRead(rSlug)}
                    className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium"
                  >
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
                <button
                  onClick={() => handleAnalysis(rSlug)}
                  className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-violet-500/15 text-violet-400 rounded-lg text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" /> Талдау
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
