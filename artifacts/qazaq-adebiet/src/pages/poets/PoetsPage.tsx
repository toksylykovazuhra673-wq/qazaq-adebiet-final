import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocation } from 'wouter';
import PoetsHero from '@/components/poets/PoetsHero';
import PoetsFilterBar from '@/components/poets/PoetsFilterBar';
import PoetsGrid from '@/components/poets/PoetsGrid';
import PoetAddModal from '@/components/poets/PoetAddModal';
import { usePoets } from '@/hooks/usePoets';

export default function PoetsPage() {
  const { poets, total, filter, suggestions, setFilter, resetFilter } = usePoets();
  const [addOpen, setAddOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleSuccess = (slug: string) => {
    setAddOpen(false);
    setLocation(`/poets/${slug}`);
  };

  return (
    <div className="min-h-screen pb-24">
      <PoetsHero filter={filter} suggestions={suggestions} setFilter={setFilter} total={total} />
      <PoetsFilterBar filter={filter} setFilter={setFilter} resetFilter={resetFilter} count={poets.length} />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        {/* Add button row */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Ақын қосу
          </button>
        </div>

        <PoetsGrid poets={poets} resetFilter={resetFilter} />
      </div>

      <PoetAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
