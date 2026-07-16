import React from 'react';
import { motion } from 'framer-motion';
import { Gavel } from 'lucide-react';
import BiCard from './BiCard';
import type { BiSheshen } from '@/types/bi';

interface Props {
  biList: BiSheshen[];
  resetFilter: () => void;
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/8 p-6 animate-pulse flex flex-col items-center gap-4">
      <div className="w-28 h-28 rounded-full bg-white/8" />
      <div className="flex gap-2">
        <div className="h-5 w-20 rounded-full bg-white/8" />
        <div className="h-5 w-16 rounded-full bg-white/8" />
      </div>
      <div className="h-6 w-32 rounded-lg bg-white/8" />
      <div className="h-4 w-full rounded bg-white/5" />
      <div className="h-4 w-3/4 rounded bg-white/5" />
      <div className="flex gap-3 w-full">
        <div className="h-8 flex-1 rounded-xl bg-white/5" />
        <div className="h-8 w-10 rounded-xl bg-white/5" />
        <div className="h-8 w-10 rounded-xl bg-white/5" />
      </div>
    </div>
  );
}

export default function BiGrid({ biList, resetFilter }: Props) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (biList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
          <Gavel className="w-9 h-9 text-teal-400/40" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-2">Табылмады</h3>
        <p className="text-white/50 mb-6">Сүзгі параметрлерін өзгертіп көріңіз.</p>
        <button
          onClick={resetFilter}
          className="px-6 py-2.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/25 text-sm font-medium transition-colors"
        >
          Барлығын көру
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {biList.map((bi, i) => (
        <BiCard key={bi.id} bi={bi} index={i} />
      ))}
    </div>
  );
}
