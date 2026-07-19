import React from 'react';
import type { Writer } from '@/types/writer';
import ItemPdfButton from '@/components/shared/ItemPdfButton';

export default function WriterPlaysTab({ writer }: { writer: Writer }) {
  if (!writer.plays || writer.plays.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Пьесалар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {writer.plays.map((play) => (
        <div key={play.id} className="glass-card p-5 rounded-xl border border-white/10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary/20 text-primary px-3 py-1 text-xs font-medium rounded-bl-lg">
            Пьеса
          </div>
          <h3 className="font-serif text-white text-xl mb-2 mt-2">{play.title}</h3>
          <p className="text-accent text-sm mb-3">{play.year}</p>
          <p className="text-white/70 text-sm line-clamp-3 flex-1">{play.description}</p>
          <ItemPdfButton
            ownerSlug={writer.slug}
            itemId={`play-${play.id}`}
            itemTitle={play.title}
          />
        </div>
      ))}
    </div>
  );
}
