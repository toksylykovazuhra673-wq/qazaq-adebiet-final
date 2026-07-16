import React from 'react';
import { useParams, useSearch } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useWriterBySlug, useRelatedWriters } from '@/hooks/useWriters';

import WriterDetailHero from '@/components/writers/detail/WriterDetailHero';
import WriterDetailTabs from '@/components/writers/detail/WriterDetailTabs';
import RelatedWriters from '@/components/writers/detail/RelatedWriters';

export default function WriterDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get('tab') || 'biography';

  const writer = useWriterBySlug(slug);
  const related = useRelatedWriters(writer?.relatedWriters ?? []);

  if (!writer) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-4xl font-serif text-white mb-4">Жазушы табылмады</h2>
        <p className="text-white/60 mb-8">Бұл мекенжай бойынша ақпарат жоқ.</p>
        <Link href="/writers" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Барлық жазушыларға қайту</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20">
      <WriterDetailHero writer={writer} />
      <div className="container mx-auto px-4 lg:px-8 mt-10">
        <WriterDetailTabs writer={writer} initialTab={initialTab} />
      </div>
      {related.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 mt-20">
          <RelatedWriters writers={related} />
        </div>
      )}
    </div>
  );
}