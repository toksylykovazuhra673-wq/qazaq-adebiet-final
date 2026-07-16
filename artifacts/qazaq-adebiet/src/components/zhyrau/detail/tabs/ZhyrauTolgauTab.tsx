import React, { useState } from 'react';
import { BookOpen, FileText, Music } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauTolgauTab({ zhyrau }: { zhyrau: Zhyrau }) {
  const themes = ['Барлығы', ...Array.from(new Set(zhyrau.tolgau.map(t => t.theme)))];
  const [activeTheme, setActiveTheme] = useState('Барлығы');

  const filtered = activeTheme === 'Барлығы' ? zhyrau.tolgau : zhyrau.tolgau.filter(t => t.theme === activeTheme);

  if (!zhyrau.tolgau || zhyrau.tolgau.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Толғаулар тізімі жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Theme filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {themes.map(theme => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
              activeTheme === theme
                ? 'bg-accent text-black border-accent'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="glass-panel rounded-2xl overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-6 py-4 text-white/60 font-medium">№</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Толғау атауы</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Кезеңі</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Тақырыбы</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Жанры</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Сипаттамасы</th>
              <th className="text-center px-6 py-4 text-white/60 font-medium">Батырмалар</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white/50">{i + 1}</td>
                <td className="px-6 py-4 text-white font-medium font-serif">{t.title}</td>
                <td className="px-6 py-4 text-accent text-xs">{t.period}</td>
                <td className="px-6 py-4 text-white/70">{t.theme}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-primary/90">{t.genre}</span>
                </td>
                <td className="px-6 py-4 text-white/60 max-w-xs">{t.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {t.hasRead && <button className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors" title="Оқу"><BookOpen className="w-4 h-4" /></button>}
                    {t.hasPdf && <button className="p-2 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent transition-colors" title="PDF"><FileText className="w-4 h-4" /></button>}
                    {t.hasAudio && <button className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors" title="Аудио"><Music className="w-4 h-4" /></button>}
                    {!t.hasRead && !t.hasPdf && !t.hasAudio && <span className="text-white/30 text-xs">—</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {filtered.map((t) => (
          <div key={t.id} className="glass-card p-5 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-serif text-white font-semibold">{t.title}</h3>
              <span className="text-accent text-xs ml-2 shrink-0">{t.period}</span>
            </div>
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-primary/90">{t.genre}</span>
              <span className="text-white/50 text-xs">{t.theme}</span>
            </div>
            <p className="text-white/60 text-sm">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
