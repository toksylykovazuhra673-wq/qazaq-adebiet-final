import React from 'react';
import { useParams, useSearch } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { usePoetBySlug, useRelatedPoets } from '@/hooks/usePoets';

import PoetDetailHero from '@/components/poets/detail/PoetDetailHero';
import PoetDetailTabs from '@/components/poets/detail/PoetDetailTabs';
import RelatedPoets from '@/components/poets/detail/RelatedPoets';

export default function PoetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get('tab') || 'biography';

  const poet = usePoetBySlug(slug);
  const related = useRelatedPoets(poet?.relatedPoets ?? []);

  if (!poet) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-4xl font-serif text-white mb-4">Ақын табылмады</h2>
        <p className="text-white/60 mb-8">Бұл мекенжай бойынша ақпарат жоқ.</p>
        <Link href="/poets" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Барлық ақындарға қайту</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20">
      <PoetDetailHero poet={poet} />
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <PoetDetailTabs poet={poet} initialTab={initialTab} />
      </div>
      {related.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mt-20">
          <RelatedPoets poets={related} />
        </div>
      )}
    </div>
  );
}
