import React from 'react';
import { Globe, Zap } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabModern({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-cyan-400" />
          <h3 className="text-cyan-300 font-semibold">Қазіргі қоғаммен байланысы</h3>
        </div>
        <p className="text-white/80 leading-relaxed">
          {analysis.modernRelevance ?? `«${analysis.title}» шығармасы уақыттан тыс актуалдылығын сақтайды.`}
        </p>
      </div>

      {/* Parallel issues */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} className="text-amber-400" />
          <h3 className="text-amber-300 text-sm font-semibold uppercase tracking-wide">Бүгінгі параллельдер</h3>
        </div>
        <div className="space-y-3">
          {[
            { then: 'Надандық пен жалқаулық', now: 'Ақпараттық тасқыннан қашып, сапалы білімнен безу' },
            { then: 'Мақтаншақтық пен өтірік', now: 'Жалған ақпарат (fake news) пен социалдық желілердегі имидж мәселелері' },
            { then: 'Пайдакүнемдік', now: 'Тұтынушылық қоғам мен адами құндылықтардың азаюы' },
            { then: '«Адам бол» шақыруы', now: 'Цифрлық ғасырда адами болмысты сақтау мәселесі' },
          ].map(({ then, now }, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] rounded-xl">
              <div>
                <p className="text-white/30 text-xs mb-1">XIX ғасыр</p>
                <p className="text-white/70 text-sm">{then}</p>
              </div>
              <div>
                <p className="text-white/30 text-xs mb-1">XXI ғасыр</p>
                <p className="text-cyan-300 text-sm">{now}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
