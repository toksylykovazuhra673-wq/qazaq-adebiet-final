import React from 'react';
import { Brain } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function TabPhilosophy({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-violet-400" />
          <h3 className="text-violet-300 font-semibold">Философиялық мәні</h3>
        </div>
        <p className="text-white/80 leading-relaxed">
          {analysis.philosophicalMeaning ?? `«${analysis.title}» — тек әдеби шығарма ғана емес, терең философиялық трактат. ${analysis.mainThought}`}
        </p>
      </div>

      {/* Key philosophical concepts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { concept: 'Ақыл', desc: 'Таным мен парасат — адам жанының жетекшісі', color: 'blue' },
          { concept: 'Жүрек', desc: 'Мейірім мен адамгершілік — ізгіліктің қайнары', color: 'red' },
          { concept: 'Еңбек', desc: 'Іс-қимыл — адамды мақсатқа жеткізетін жол', color: 'green' },
        ].map(({ concept, desc, color }) => (
          <div key={concept} className={`bg-${color}-500/10 border border-${color}-500/20 rounded-xl p-4 text-center`}>
            <p className={`text-${color}-400 text-2xl font-serif font-bold mb-2`}>{concept}</p>
            <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Философиялық дәстүрмен байланысы</p>
        <p className="text-white/70 text-sm leading-relaxed">
          Абайдың ойлары Аристотельдің этика ілімімен, Руссоның табиғи адам тұжырымымен,
          Конфуцийдің рухани жетілу идеясымен үндеседі. «Адам бол» деген формула —
          гуманизмнің философиялық квинтэссенциясы.
        </p>
      </div>
    </div>
  );
}
