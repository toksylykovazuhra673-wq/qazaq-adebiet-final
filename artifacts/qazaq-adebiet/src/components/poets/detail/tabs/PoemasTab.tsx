import React from 'react';
import { BookMarked } from 'lucide-react';
import type { Poet } from '@/types/poet';
import ItemPdfButton from '@/components/shared/ItemPdfButton';

export default function PoemasTab({ poet }: { poet: Poet }) {
  if (!poet.poemas || poet.poemas.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Поэмалар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {poet.poemas.map((poema) => (
        <div key={poema.id} className="glass-card rounded-2xl p-6 relative group overflow-hidden flex flex-col">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookMarked className="w-24 h-24 text-primary" />
          </div>

          <div className="relative z-10 flex flex-col flex-1">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-accent mb-4 self-start">
              {poema.year}
            </div>

            <h4 className="text-xl font-serif font-semibold text-white mb-3 leading-snug">
              {poema.title}
            </h4>

            <p className="text-white/60 text-sm leading-relaxed flex-1">
              {poema.description}
            </p>

            {/* PDF upload button */}
            <ItemPdfButton
              ownerSlug={poet.slug}
              itemId={`poema-${poema.id}`}
              itemTitle={poema.title}
              variant="inline"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
