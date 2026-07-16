import React from 'react';
import PoetsHero from '@/components/poets/PoetsHero';
import PoetsFilterBar from '@/components/poets/PoetsFilterBar';
import PoetsGrid from '@/components/poets/PoetsGrid';
import { usePoets } from '@/hooks/usePoets';

export default function PoetsPage() {
  const { poets, total, filter, suggestions, setFilter, resetFilter } = usePoets();

  return (
    <div className="min-h-screen pb-24">
      <PoetsHero filter={filter} suggestions={suggestions} setFilter={setFilter} total={total} />
      <PoetsFilterBar filter={filter} setFilter={setFilter} resetFilter={resetFilter} count={poets.length} />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <PoetsGrid poets={poets} resetFilter={resetFilter} />
      </div>
    </div>
  );
}
