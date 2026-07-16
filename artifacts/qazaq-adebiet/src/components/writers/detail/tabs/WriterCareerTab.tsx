import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { Writer, WriterCareerItem } from '@/types/writer';

function CareerCard({ item, index }: { item: WriterCareerItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex gap-5"
    >
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(5,150,105,0.35)]">
          <Briefcase size={16} className="text-white" />
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-emerald-500/30 to-transparent mt-2" />
      </div>

      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-emerald-300 text-xs font-semibold">{item.years}</span>
          {item.city && <span className="text-white/35 text-xs">· {item.city}</span>}
        </div>
        <h4 className="text-white font-bold text-base mb-0.5">{item.position}</h4>
        <p className="text-white/55 text-sm mb-2">{item.organization}</p>
        {item.note && (
          <p className="text-white/45 text-sm leading-relaxed bg-white/4 border border-white/8 rounded-xl px-4 py-3">
            {item.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function WriterCareerTab({ writer }: { writer: Writer }) {
  const items = writer.career ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Briefcase size={40} className="text-white/15 mb-4" />
        <p className="text-white/30">Қызметтері туралы мәлімет толықтырылуда</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-6">Қызметтері</h2>
      <div>
        {items.map((item, i) => <CareerCard key={i} item={item} index={i} />)}
      </div>
    </div>
  );
}
