import React from 'react';
import WritersHero from '@/components/writers/WritersHero';
import WritersFilterBar from '@/components/writers/WritersFilterBar';
import WritersGrid from '@/components/writers/WritersGrid';
import { useWriters } from '@/hooks/useWriters';

export default function WritersPage() {
  const { writers, total, filter, suggestions, setFilter, resetFilter } = useWriters();

  return (
    <div className="min-h-screen pb-24">
      <WritersHero filter={filter} suggestions={suggestions} setFilter={setFilter} total={total} />
      <WritersFilterBar filter={filter} setFilter={setFilter} resetFilter={resetFilter} count={writers.length} />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <WritersGrid writers={writers} resetFilter={resetFilter} />
      </div>
    </div>
  );
}