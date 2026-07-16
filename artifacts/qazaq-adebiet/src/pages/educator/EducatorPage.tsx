import React from 'react';
import EducatorHero from '@/components/educator/EducatorHero';
import EducatorFilterBar from '@/components/educator/EducatorFilterBar';
import EducatorGrid from '@/components/educator/EducatorGrid';
import { useEducator } from '@/hooks/useEducator';

export default function EducatorPage() {
  const { educatorList, total, filter, suggestions, setFilter, resetFilter } = useEducator();

  return (
    <div className="min-h-screen pb-24">
      <EducatorHero
        filter={filter}
        suggestions={suggestions}
        setFilter={setFilter}
        total={total}
      />
      <EducatorFilterBar
        filter={filter}
        setFilter={setFilter}
        resetFilter={resetFilter}
        count={educatorList.length}
      />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <EducatorGrid educatorList={educatorList} resetFilter={resetFilter} />
      </div>
    </div>
  );
}
