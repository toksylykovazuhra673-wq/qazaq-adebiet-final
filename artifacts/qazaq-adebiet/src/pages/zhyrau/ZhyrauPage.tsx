import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ZhyrauHero from '@/components/zhyrau/ZhyrauHero';
import ZhyrauFilterBar from '@/components/zhyrau/ZhyrauFilterBar';
import ZhyrauGrid from '@/components/zhyrau/ZhyrauGrid';
import ZhyrauAddModal from '@/components/zhyrau/ZhyrauAddModal';
import { useZhyrau } from '@/hooks/useZhyrau';

export default function ZhyrauPage() {
  const { zhyrauList, total, filter, suggestions, setFilter, resetFilter } = useZhyrau();
  const [modalOpen, setModalOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleSuccess = (slug: string) => {
    setModalOpen(false);
    navigate(`/zhyrau/${slug}`);
  };

  return (
    <div className="min-h-screen pb-24">
      <ZhyrauHero filter={filter} suggestions={suggestions} setFilter={setFilter} total={total} />
      <ZhyrauFilterBar filter={filter} setFilter={setFilter} resetFilter={resetFilter} count={zhyrauList.length} />

      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <ZhyrauGrid zhyrauList={zhyrauList} resetFilter={resetFilter} />
      </div>

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setModalOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-medium text-sm shadow-2xl shadow-primary/40 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Жырау қосу
      </motion.button>

      <ZhyrauAddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
