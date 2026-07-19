import React, { useState } from 'react';
import { Presentation, BookOpen, CheckSquare, BarChart2, Download } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabTeacher({ analysis }: { analysis: Analysis }) {
  const [section, setSection] = useState('plan');
  const lp = analysis.lessonPlan;

  const handleDownload = () => {
    if (!lp) return;
    const lines = [
      `ҚМЖ — ${lp.topic}`,
      `Пән: ${lp.subject} · ${lp.grade} сынып · ${lp.duration}`,
      '', '=== МАҚСАТТАР ===',
      ...lp.objectives.map((o, i) => `${i + 1}. ${o}`),
      '', '=== САБАҚ БАРЫСЫ ===',
      ...lp.activities.map(a => `${a.step}. ${a.name}\n   ${a.description}`),
      '', '=== БАҒАЛАУ ===', lp.assessment,
      '', '=== ДЕСКРИПТОРЛАР ===',
      ...lp.descriptors.map((d, i) => `${i + 1}. ${d}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: `sabaq-zhospary-${analysis.workSlug}.txt` }).click();
    URL.revokeObjectURL(url);
  };

  if (!lp) {
    return (
      <div className="text-center py-16 text-white/40">
        <Presentation size={40} className="mx-auto mb-4 opacity-30" />
        <p>Мұғалім материалдары қол жетімсіз.</p>
      </div>
    );
  }

  const SECTIONS = [
    { id: 'plan',     label: 'Сабақ жоспары',    icon: <BookOpen size={13} /> },
    { id: 'assess',   label: 'Бағалау',           icon: <CheckSquare size={13} /> },
    { id: 'rubric',   label: 'Рубрика',           icon: <BarChart2 size={13} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-xl font-bold">Мұғалімге арналған материалдар</h2>
          <p className="text-white/50 text-sm">{lp.subject} · {lp.grade} сынып · {lp.duration}</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 text-sm font-medium transition-colors"
        >
          <Download size={14} /> Жоспарды жүктеу
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              section === s.id
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/8 border border-white/8'
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Lesson Plan */}
      {section === 'plan' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Тақырып</p>
            <p className="text-white font-semibold">{lp.topic}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Оқу мақсаттары</p>
            <ul className="space-y-2">
              {lp.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                  <span className="text-green-400 shrink-0">✦</span> {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Сабақ барысы</p>
            <div className="space-y-3">
              {lp.activities.map(a => (
                <div key={a.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                    <span className="text-green-400 text-xs font-bold">{a.step}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{a.name}</p>
                    <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assessment */}
      {section === 'assess' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Бағалау критерийі</p>
            <p className="text-white/80 text-sm leading-relaxed">{lp.assessment}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Дескрипторлар</p>
            <ul className="space-y-2">
              {lp.descriptors.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                  <span className="text-amber-400 shrink-0">D{i + 1}</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Rubric */}
      {section === 'rubric' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left p-3 text-white/50 font-medium">Критерий</th>
                {['4', '3', '2', '1'].map(n => (
                  <th key={n} className="text-center p-3 text-white/50 font-medium w-32">{n} ұпай</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {lp.rubric.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-medium">{row.criterion}</td>
                  {(['4', '3', '2', '1'] as const).map(n => (
                    <td key={n} className="p-3 text-white/60 text-xs text-center">{row[n]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
