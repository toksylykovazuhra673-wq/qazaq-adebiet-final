import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { PlotStage } from '@/types/analysis';

const STAGE_COLORS: Record<string, string> = {
  Exposition: 'bg-violet-500/20 border-violet-500/30 text-violet-300',
  Complication: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  'Rising Action': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
  Climax: 'bg-rose-500/20 border-rose-500/30 text-rose-300',
  'Falling Action': 'bg-amber-500/20 border-amber-500/30 text-amber-300',
  Resolution: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
};

interface Props {
  plot: PlotStage[];
}

export default function PlotSection({ plot }: Props) {
  return (
    <AccordionSection
      id="plot"
      title="Сюжет"
      icon={<GitBranch size={18} />}
      badge={plot.length}
      accentColor="from-emerald-500 to-teal-600"
    >
      <div className="grid gap-4">
        {plot.map((stage, idx) => {
          const colorClass =
            STAGE_COLORS[stage.stage] ?? 'bg-white/10 border-white/20 text-white/70';

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-xl border border-white/8 bg-white/5 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-white font-semibold">{stage.stageKaz}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full border text-xs font-medium ${colorClass}`}
                    >
                      {stage.stage}
                    </span>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed mb-3">
                    {stage.description}
                  </p>
                  <ul className="space-y-1.5">
                    {stage.events.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/50 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AccordionSection>
  );
}
