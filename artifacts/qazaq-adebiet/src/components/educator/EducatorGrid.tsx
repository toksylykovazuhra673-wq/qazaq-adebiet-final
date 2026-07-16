import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import type { Educator } from '@/types/educator';
import EducatorCard from './EducatorCard';

interface Props {
  educatorList: Educator[];
  resetFilter: () => void;
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl border border-white/6 p-6 animate-pulse space-y-3">
      <div className="flex justify-center">
        <div className="w-28 h-28 rounded-full bg-white/8" />
      </div>
      <div className="h-3 w-24 bg-white/8 rounded-full mx-auto" />
      <div className="h-5 w-32 bg-white/6 rounded mx-auto" />
      <div className="h-3 w-20 bg-white/5 rounded mx-auto" />
      <div className="h-4 w-full bg-white/5 rounded" />
      <div className="h-4 w-4/5 bg-white/5 rounded" />
      <div className="h-8 w-full bg-white/5 rounded-xl mt-3" />
    </div>
  );
}

export default function EducatorGrid({ educatorList, resetFilter }: Props) {
  if (educatorList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <GraduationCap className="w-16 h-16 text-white/15 mb-4" />
        <h3 className="text-xl font-serif text-white/60 mb-2">
          Ағартушы табылмады
        </h3>
        <p className="text-white/40 text-sm mb-6">
          Іздеу немесе сүзгіні өзгертіп көріңіз
        </p>
        <button
          onClick={resetFilter}
          className="px-5 py-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors"
        >
          Барлығын көру
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {educatorList.map((educator, i) => (
          <EducatorCard key={educator.id} educator={educator} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
