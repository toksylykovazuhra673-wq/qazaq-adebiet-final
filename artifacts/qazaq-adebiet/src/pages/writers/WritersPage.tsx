import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocation } from 'wouter';
import WritersHero      from '@/components/writers/WritersHero';
import WritersFilterBar from '@/components/writers/WritersFilterBar';
import WritersGrid      from '@/components/writers/WritersGrid';
import WriterAddModal   from '@/components/writers/WriterAddModal';
import { useWriters }  from '@/hooks/useWriters';

export default function WritersPage() {
  const {
    writers,
    total,
    filter,
    suggestions,
    alphabetLetters,
    hasActiveFilters,
    stats,
    setFilter,
    resetFilter,
  } = useWriters();

  const [addOpen, setAddOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleSuccess = (slug: string) => {
    setAddOpen(false);
    setLocation(`/writers/${slug}`);
  };

  return (
    <div className="min-h-screen pb-24">
      <WritersHero
        filter={filter}
        suggestions={suggestions}
        setFilter={setFilter}
        total={total}
        stats={stats}
      />
      <WritersFilterBar
        filter={filter}
        setFilter={setFilter}
        resetFilter={resetFilter}
        count={writers.length}
        alphabetLetters={alphabetLetters}
        hasActiveFilters={hasActiveFilters}
      />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        {/* Add button row */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            Жазушы қосу
          </button>
        </div>

        <WritersGrid writers={writers} resetFilter={resetFilter} />
      </div>

      <WriterAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
