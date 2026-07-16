import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { ChronologyEvent } from '@/types/analysis';

const CAT_STYLES: Record<string, { dot: string; badge: string }> = {
  biography:  { dot: 'bg-violet-500', badge: 'bg-violet-500/15 border-violet-500/30 text-violet-300' },
  literary:   { dot: 'bg-emerald-500', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' },
  historical: { dot: 'bg-amber-500',  badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300' },
};
const CAT_LABELS: Record<string, string> = {
  biography: 'Өмірбаян', literary: 'Шығармашылық', historical: 'Тарихи',
};

interface Props {
  events: ChronologyEvent[];
}

export default function ChronologySection({ events }: Props) {
  return (
    <AccordionSection
      id="chronology"
      title="Хронология"
      icon={<Clock size={18} />}
      badge={events.length}
      accentColor="from-cyan-500 to-blue-600"
    >
      {/* legend */}
      <div className="flex gap-4 flex-wrap mb-5">
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-white/50">
            <div className={`w-2 h-2 rounded-full ${CAT_STYLES[key].dot}`} />
            {label}
          </div>
        ))}
      </div>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-5">
          {events.map((ev, idx) => {
            const styles = CAT_STYLES[ev.category] ?? CAT_STYLES.historical;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 items-start"
              >
                {/* year */}
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="text-white/60 text-xs font-mono font-semibold leading-tight">
                    {ev.year}
                  </span>
                </div>

                {/* dot */}
                <div className="flex-shrink-0 w-5 flex items-center justify-center pt-0.5 z-10">
                  <div className={`w-2.5 h-2.5 rounded-full ${styles.dot} ring-2 ring-slate-950`} />
                </div>

                {/* content */}
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-semibold text-sm leading-tight">{ev.event}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-xs ${styles.badge}`}>
                      {CAT_LABELS[ev.category]}
                    </span>
                  </div>
                  {ev.description && (
                    <p className="text-white/50 text-xs leading-relaxed">{ev.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AccordionSection>
  );
}
