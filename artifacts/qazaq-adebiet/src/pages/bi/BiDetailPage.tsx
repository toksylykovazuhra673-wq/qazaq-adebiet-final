import React from 'react';
import { useParams, useSearch } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useBiBySlug, useRelatedBi } from '@/hooks/useBi';

import BiDetailHero from '@/components/bi/detail/BiDetailHero';
import BiDetailTabs from '@/components/bi/detail/BiDetailTabs';
import RelatedBi from '@/components/bi/detail/RelatedBi';

export default function BiDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get('tab') || 'biography';

  const bi = useBiBySlug(slug);
  const related = useRelatedBi(bi?.relatedPersons ?? []);

  if (!bi) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-4xl font-serif text-white mb-4">Тұлға табылмады</h2>
        <p className="text-white/60 mb-8">Бұл мекенжай бойынша ақпарат жоқ.</p>
        <Link
          href="/bi-sheshender"
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Барлық би-шешендер</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20">
      <BiDetailHero bi={bi} />
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <BiDetailTabs bi={bi} initialTab={initialTab} />
      </div>
      {related.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mt-20">
          <RelatedBi biList={related} />
        </div>
      )}
    </div>
  );
}
