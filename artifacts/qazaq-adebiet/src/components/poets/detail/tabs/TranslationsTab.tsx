import React from 'react';
import { Languages } from 'lucide-react';
import type { Poet } from '@/types/poet';

export default function TranslationsTab({ poet }: { poet: Poet }) {
  if (!poet.translations || poet.translations.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Аудармалар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Languages className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-serif text-white">Аударма еңбектері</h3>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <th className="p-4 md:p-5 font-medium w-16 text-center">№</th>
              <th className="p-4 md:p-5 font-medium">Түпнұсқа атауы</th>
              <th className="p-4 md:p-5 font-medium">Авторы</th>
              <th className="p-4 md:p-5 font-medium w-32">Аударылған жылы</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {poet.translations.map((trans, idx) => (
              <tr key={trans.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 md:p-5 text-center text-white/40">{idx + 1}</td>
                <td className="p-4 md:p-5 font-medium text-white">{trans.originalTitle}</td>
                <td className="p-4 md:p-5">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/80">
                    {trans.author}
                  </span>
                </td>
                <td className="p-4 md:p-5 text-accent">{trans.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
