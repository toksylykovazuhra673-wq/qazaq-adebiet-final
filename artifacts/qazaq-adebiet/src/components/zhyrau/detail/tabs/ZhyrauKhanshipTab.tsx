import React from 'react';
import { Crown, History } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauKhanshipTab({ zhyrau }: { zhyrau: Zhyrau }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-serif text-white">Қазақ хандығымен байланысы</h2>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="px-4 py-1.5 bg-accent/20 border border-accent/40 text-accent rounded-full text-sm font-medium">
            Хан кезеңі: {zhyrau.khanPeriod}
          </span>
        </div>

        {zhyrau.khanConnection && (
          <p className="text-lg text-white/80 leading-relaxed italic border-l-2 border-accent/50 pl-6">
            {zhyrau.khanConnection}
          </p>
        )}
      </div>

      {zhyrau.historicalEvents && zhyrau.historicalEvents.length > 0 && (
        <div className="glass-panel p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-serif text-white">Тарихи оқиғалар</h3>
          </div>
          <div className="flex flex-col gap-4">
            {zhyrau.historicalEvents.map(ev => (
              <div key={ev.id} className="glass-card p-4 rounded-xl flex items-start gap-4">
                <span className="text-accent font-bold text-lg shrink-0 w-16">{ev.year}</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">{ev.title}</h4>
                  <p className="text-white/60 text-sm">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
