import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';
import ZhyrauCard from './ZhyrauCard';

interface ZhyrauGridProps {
  zhyrauList: Zhyrau[];
  resetFilter: () => void;
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full animate-pulse">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-white/10 mb-4" />
        <div className="w-24 h-6 rounded-full bg-white/10 mb-3" />
        <div className="w-48 h-6 rounded bg-white/10 mb-2" />
        <div className="w-20 h-4 rounded bg-white/10 mb-3" />
        <div className="w-full h-10 rounded bg-white/10" />
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mb-5">
        <div className="h-10 bg-white/10 rounded" />
        <div className="h-10 bg-white/10 rounded" />
        <div className="h-10 bg-white/10 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-white/10 rounded flex-1" />
        <div className="h-10 bg-white/10 rounded flex-1" />
        <div className="h-10 bg-white/10 rounded flex-1" />
      </div>
    </div>
  );
}

export default function ZhyrauGrid({ zhyrauList, resetFilter, isLoading = false }: ZhyrauGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (zhyrauList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <SlidersHorizontal className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-2">Нәтиже табылмады</h3>
        <p className="text-white/60 mb-6">Сүзгі параметрлерін өзгертіп көріңіз.</p>
        <button
          onClick={resetFilter}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg"
        >
          Сүзгілерді тазалау
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {zhyrauList.map((z, index) => (
        <ZhyrauCard key={z.id} zhyrau={z} index={index} />
      ))}
    </div>
  );
}
