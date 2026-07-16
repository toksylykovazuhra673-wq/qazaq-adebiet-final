import React from 'react';
import { useParams, useSearch } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useEducatorBySlug, useRelatedEducators } from '@/hooks/useEducator';

import EducatorDetailHero from '@/components/educator/detail/EducatorDetailHero';
import EducatorDetailTabs from '@/components/educator/detail/EducatorDetailTabs';
import RelatedEducators from '@/components/educator/detail/RelatedEducators';

export default function EducatorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get('tab') || 'biography';

  const educator = useEducatorBySlug(slug);
  const related = useRelatedEducators(educator?.relatedPersons ?? []);

  if (!educator) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-4xl font-serif text-white mb-4">Тұлға табылмады</h2>
        <p className="text-white/60 mb-8">Бұл мекенжай бойынша ақпарат жоқ.</p>
        <Link
          href="/educators"
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Барлық ағартушылар</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20">
      <EducatorDetailHero educator={educator} />
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <EducatorDetailTabs educator={educator} initialTab={initialTab} />
      </div>
      {related.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mt-20">
          <RelatedEducators educatorList={related} />
        </div>
      )}
    </div>
  );
}
