import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, ChevronDown } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { StylisticDevice } from '@/types/analysis';

const GROUP_META = {
  azharlau: { label: 'Ажарлау тәсілдері', color: 'bg-violet-500/15 border-violet-500/25 text-violet-300' },
  qubyltu:  { label: 'Құбылту тәсілдері', color: 'bg-rose-500/15 border-rose-500/25 text-rose-300' },
  ayshyqtau:{ label: 'Айшықтау тәсілдері', color: 'bg-amber-500/15 border-amber-500/25 text-amber-300' },
};

function DeviceCard({ device }: { device: StylisticDevice }) {
  const [open, setOpen] = useState(false);
  const meta = GROUP_META[device.group];

  return (
    <div className="rounded-xl border border-white/8 bg-white/5 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{device.nameKaz}</span>
            <span className="text-white/35 text-xs">({device.name})</span>
            <span className={`px-2 py-0.5 rounded-full border text-xs ${meta.color}`}>
              {meta.label}
            </span>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-white/40" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 space-y-3">
              {device.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-white/5 border border-white/8 p-3">
                  <blockquote className="text-white/80 text-sm font-medium italic mb-2 border-l-2 border-white/20 pl-3">
                    «{ex.text}»
                  </blockquote>
                  <p className="text-white/50 text-xs leading-relaxed">{ex.explanation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  devices: StylisticDevice[];
}

export default function StylisticDevicesSection({ devices }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>('all');

  const groups = ['all', 'azharlau', 'qubyltu', 'ayshyqtau'] as const;
  const filtered = activeGroup === 'all' ? devices : devices.filter((d) => d.group === activeGroup);

  return (
    <AccordionSection
      id="stylistic-devices"
      title="Көркемдегіш тәсілдер"
      icon={<Wand2 size={18} />}
      badge={devices.length}
      accentColor="from-rose-500 to-orange-600"
    >
      {/* filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setActiveGroup('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeGroup === 'all'
              ? 'bg-white/15 text-white'
              : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          Барлығы ({devices.length})
        </button>
        {(['azharlau', 'qubyltu', 'ayshyqtau'] as const).map((g) => {
          const count = devices.filter((d) => d.group === g).length;
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeGroup === g
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {GROUP_META[g].label.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((device) => (
          <DeviceCard key={device.name} device={device} />
        ))}
      </div>
    </AccordionSection>
  );
}
