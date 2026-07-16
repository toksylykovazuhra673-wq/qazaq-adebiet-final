import React from 'react';
import ZhyrauHero from '@/components/zhyrau/ZhyrauHero';
import ZhyrauFilterBar from '@/components/zhyrau/ZhyrauFilterBar';
import ZhyrauGrid from '@/components/zhyrau/ZhyrauGrid';
import { useZhyrau } from '@/hooks/useZhyrau';

export default function ZhyrauPage() {
  const { zhyrauList, total, filter, suggestions, setFilter, resetFilter } = useZhyrau();

  return (
    <div className="min-h-screen pb-24">
      <ZhyrauHero filter={filter} suggestions={suggestions} setFilter={setFilter} total={total} />
      <ZhyrauFilterBar filter={filter} setFilter={setFilter} resetFilter={resetFilter} count={zhyrauList.length} />
      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <ZhyrauGrid zhyrauList={zhyrauList} resetFilter={resetFilter} />
      </div>
    </div>
  );
}
