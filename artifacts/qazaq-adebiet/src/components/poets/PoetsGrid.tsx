import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import type { Poet } from '@/types/poet';
import PoetCard from './PoetCard';

interface PoetsGridProps {
  poets: Poet[];
  resetFilter: () => void;
  isLoading?: boolean;
}

export default function PoetsGrid({ poets, resetFilter, isLoading = false }: PoetsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex flex-col h-[400px] animate-pulse">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-white/10 mb-4"></div>
              <div className="w-24 h-6 bg-white/10 rounded-full mb-3"></div>
              <div className="w-48 h-6 bg-white/10 rounded mb-2"></div>
              <div className="w-32 h-4 bg-white/10 rounded mb-4"></div>
              <div className="w-full h-4 bg-white/10 rounded mb-1"></div>
              <div className="w-3/4 h-4 bg-white/10 rounded"></div>
            </div>
            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mb-5">
              <div className="h-8 bg-white/10 rounded"></div>
              <div className="h-8 bg-white/10 rounded mx-2"></div>
              <div className="h-8 bg-white/10 rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-white/10 rounded-xl"></div>
              <div className="flex-1 h-10 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (poets.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto mt-20 glass-panel rounded-3xl p-10 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <SlidersHorizontal className="w-8 h-8 text-white/50" />
        </div>
        <h3 className="text-2xl font-serif font-semibold text-white mb-2">Нәтиже табылмады</h3>
        <p className="text-white/60 mb-8">
          Іздеу немесе сүзгілеу шарттарына сәйкес келетін ақын табылмады. Сүзгілерді өзгертіп көріңіз.
        </p>
        <button
          onClick={resetFilter}
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          Сүзгілерді тазалау
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {poets.map((poet, idx) => (
        <PoetCard key={poet.id} poet={poet} index={idx} />
      ))}
    </div>
  );
}
