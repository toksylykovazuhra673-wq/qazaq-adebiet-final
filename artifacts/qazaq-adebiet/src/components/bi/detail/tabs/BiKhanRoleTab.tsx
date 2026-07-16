import React from 'react';
import { Crown, Shield, Users, Swords } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

export default function BiKhanRoleTab({ bi }: { bi: BiSheshen }) {
  const hasDiplomacy = bi.diplomaticService && bi.diplomaticService.length > 0;
  const hasCourt = bi.courtCases && bi.courtCases.length > 0;

  return (
    <div className="space-y-6">
      {/* Main description */}
      <div className="glass-panel rounded-2xl p-7 border border-amber-500/15">
        <div className="flex items-start gap-4">
          <Crown className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-serif text-white font-semibold mb-3">
              Қазақ хандығындағы рөлі
            </h2>
            <p className="text-white/75 leading-relaxed">
              {bi.fullName} — {bi.historicalPeriod} дәуірінің {bi.profession.join(', ')} ретінде белгілі тұлға.
              Ол Қазақ хандығының {bi.era} кезеңіндегі мемлекеттік ісіне белсене қатысты.
            </p>
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-white/8">
          <Shield className="w-6 h-6 text-teal-400 mb-3" />
          <h3 className="text-white font-semibold mb-1 text-sm">Билік рөлі</h3>
          <p className="text-white/55 text-sm">
            {bi.profession.includes('Би')
              ? `${bi.fullName} ел билеуде маңызды рөл атқарды. Рулар арасындағы дауларды шешіп, заң тәртібін орнықтырды.`
              : `${bi.fullName} мемлекеттік шешімдерде кеңесші ретінде маңызды рөл атқарды.`}
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/8">
          <Users className="w-6 h-6 text-amber-400 mb-3" />
          <h3 className="text-white font-semibold mb-1 text-sm">Халыққа қызметі</h3>
          <p className="text-white/55 text-sm">
            {bi.oratoryCount > 0
              ? `${bi.oratoryCount} шешендік сөзінде халқының мүддесін, бірлігін, еркіндігін жырлады.`
              : `Халық мүддесін қорғауда ерекше орын алды.`}
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/8">
          <Swords className="w-6 h-6 text-rose-400 mb-3" />
          <h3 className="text-white font-semibold mb-1 text-sm">Тарихи оқиғалардағы рөлі</h3>
          <p className="text-white/55 text-sm">
            {bi.historicalEvents.length > 0
              ? bi.historicalEvents[0].title + ' — ' + bi.historicalEvents[0].description
              : `${bi.historicalPeriod} кезеңінде маңызды тарихи рөл атқарды.`}
          </p>
        </div>
      </div>

      {/* Diplomatic service summary */}
      {hasDiplomacy && (
        <div className="glass-panel rounded-xl p-5 border border-teal-500/15">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Crown className="w-4 h-4 text-teal-400" />
            Елшілік миссиялары
          </h3>
          <ul className="space-y-2">
            {bi.diplomaticService.map((d) => (
              <li key={d.id} className="flex items-start gap-3 text-sm">
                <span className="text-teal-400 font-mono text-xs shrink-0 mt-0.5">{d.year}</span>
                <div>
                  <span className="text-white/80 font-medium">{d.title}</span>
                  <span className="text-white/40"> — </span>
                  <span className="text-emerald-400/80">{d.result}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Court cases summary */}
      {hasCourt && (
        <div className="glass-panel rounded-xl p-5 border border-amber-500/15">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Билік шешімдері
          </h3>
          <ul className="space-y-2">
            {bi.courtCases.map((c) => (
              <li key={c.id} className="flex items-start gap-3 text-sm">
                <span className="text-amber-400 font-mono text-xs shrink-0 mt-0.5">{c.year}</span>
                <div>
                  <span className="text-white/80 font-medium">{c.title}</span>
                  <span className="text-white/40"> — </span>
                  <span className="text-emerald-400/80">{c.verdict}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
