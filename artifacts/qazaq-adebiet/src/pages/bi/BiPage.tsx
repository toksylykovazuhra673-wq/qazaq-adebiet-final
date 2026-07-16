import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import BiHero from '@/components/bi/BiHero';
import BiFilterBar from '@/components/bi/BiFilterBar';
import BiGrid from '@/components/bi/BiGrid';
import BiAddModal from '@/components/bi/BiAddModal';
import { useBi } from '@/hooks/useBi';

export default function BiPage() {
  const { biList, total, filter, suggestions, setFilter, resetFilter } = useBi();
  const [modalOpen, setModalOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleSuccess = (slug: string) => { setModalOpen(false); navigate(`/bi-sheshender/${slug}`); };

  return (
    <div className="min-h-screen pb-24">
      <BiHero filter={filter} suggestions={suggestions} setFilter={setFilter} total={total} />
      <BiFilterBar filter={filter} setFilter={setFilter} resetFilter={resetFilter} count={biList.length} />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <BiGrid biList={biList} resetFilter={resetFilter} />
      </div>

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setModalOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm shadow-2xl shadow-teal-600/30 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Би-шешен қосу
      </motion.button>

      <BiAddModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} />
    </div>
  );
}
