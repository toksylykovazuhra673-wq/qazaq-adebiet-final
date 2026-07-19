import React from 'react';
import { FileText, Download } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabSynopsis({ analysis }: { analysis: Analysis }) {
  const synopsis = analysis.synopsis;

  const handleDownload = () => {
    if (!synopsis) return;
    const content = `КОНСПЕКТ\n\n${analysis.title}\n${analysis.author} · ${analysis.period}\n\n${'─'.repeat(50)}\n\n${synopsis}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: `${analysis.workSlug}-konspekt.txt` }).click();
    URL.revokeObjectURL(url);
  };

  if (!synopsis) {
    return (
      <div className="text-center py-16 text-white/40">
        <FileText size={40} className="mx-auto mb-4 opacity-30" />
        <p>Конспект қол жетімсіз.</p>
      </div>
    );
  }

  const lines = synopsis.split('\n');

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Қысқаша конспект</h2>
          <p className="text-white/50 text-sm">{analysis.title} · {analysis.author}</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 text-sm font-medium transition-colors"
        >
          <Download size={14} /> TXT жүктеу
        </button>
      </div>

      {/* Synopsis content */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 font-mono text-sm leading-loose">
        {lines.map((line, i) => {
          if (line.startsWith('•')) {
            return (
              <div key={i} className="flex items-start gap-2 mb-1">
                <span className="text-violet-400 mt-0.5">•</span>
                <span className="text-white/80">{line.slice(1).trim()}</span>
              </div>
            );
          }
          if (line.startsWith('===')) {
            return <p key={i} className="text-violet-300 font-bold mt-5 mb-2 not-italic">{line.replace(/=/g, '').trim()}</p>;
          }
          if (!line.trim()) return <div key={i} className="h-2" />;
          return <p key={i} className="text-white/80 mb-1">{line}</p>;
        })}
      </div>

      {/* Print hint */}
      <p className="text-white/25 text-xs mt-4 text-center">
        Басып шығару үшін: жоғарыдағы 🖨 батырмасын басыңыз
      </p>
    </div>
  );
}
