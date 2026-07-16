import React from 'react';
import { useParams, useSearch } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useZhyrauBySlug, useRelatedZhyrau } from '@/hooks/useZhyrau';

import ZhyrauDetailHero from '@/components/zhyrau/detail/ZhyrauDetailHero';
import ZhyrauDetailTabs from '@/components/zhyrau/detail/ZhyrauDetailTabs';
import RelatedZhyrau from '@/components/zhyrau/detail/RelatedZhyrau';

export default function ZhyrauDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get('tab') || 'biography';

  const zhyrau = useZhyrauBySlug(slug);
  const related = useRelatedZhyrau(zhyrau?.relatedZhyrau ?? []);

  if (!zhyrau) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-4xl font-serif text-white mb-4">Жырау табылмады</h2>
        <p className="text-white/60 mb-8">Бұл мекенжай бойынша ақпарат жоқ.</p>
        <Link href="/zhyrau" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Барлық жыраулар</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20">
      <ZhyrauDetailHero zhyrau={zhyrau} />
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <ZhyrauDetailTabs zhyrau={zhyrau} initialTab={initialTab} />
      </div>
      {related.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mt-20">
          <RelatedZhyrau zhyrauList={related} />
        </div>
      )}
    </div>
  );
}
