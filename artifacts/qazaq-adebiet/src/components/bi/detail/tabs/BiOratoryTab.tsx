import React, { useState } from 'react';
import { BookOpen, FileText, Music } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

export default function BiOratoryTab({ bi }: { bi: BiSheshen }) {
  const themes = ['Барлығы', ...Array.from(new Set(bi.oratoryWords.map((w) => w.theme)))];
  const [activeTheme, setActiveTheme] = useState('Барлығы');

  const filtered =
    activeTheme === 'Барлығы'
      ? bi.oratoryWords
      : bi.oratoryWords.filter((w) => w.theme === activeTheme);

  if (!bi.oratoryWords || bi.oratoryWords.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Шешендік сөздер жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Theme filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
              activeTheme === theme
                ? 'bg-teal-500 text-white border-teal-500'
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
              <th className="text-left px-6 py-4 text-white/60 font-medium">Атауы</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Тақырыбы</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Түрі</th>
              <th className="text-left px-6 py-4 text-white/60 font-medium">Сипаттамасы</th>
              <th className="text-center px-6 py-4 text-white/60 font-medium">Батырмалар</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => (
              <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white/50">{i + 1}</td>
                <td className="px-6 py-4 text-white font-medium font-serif">{w.title}</td>
                <td className="px-6 py-4 text-teal-400 text-xs">{w.theme}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-amber-400/80">{w.type}</span>
                </td>
                <td className="px-6 py-4 text-white/60 max-w-xs text-sm">{w.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {w.hasRead && (
                      <button className="p-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 transition-colors" title="Оқу">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}
                    {w.hasPdf && (
                      <button className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 transition-colors" title="PDF">
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                    {w.hasAudio && (
                      <button className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 transition-colors" title="Аудио">
                        <Music className="w-4 h-4" />
                      </button>
                    )}
                    {!w.hasRead && !w.hasPdf && !w.hasAudio && (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {filtered.map((w) => (
          <div key={w.id} className="glass-card p-5 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-serif text-white font-semibold">{w.title}</h3>
              <span className="text-teal-400 text-xs ml-2 shrink-0">{w.theme}</span>
            </div>
            <span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-amber-400/80 mb-2">{w.type}</span>
            <p className="text-white/60 text-sm">{w.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
