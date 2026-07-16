import React from 'react';
import type { Poet } from '@/types/poet';

export default function BiographyTab({ poet }: { poet: Poet }) {
  if (!poet.biography) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Өмірбаян туралы мәлімет қосылмаған.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-10 lg:p-12">
      <div className="prose prose-invert prose-lg max-w-4xl mx-auto font-sans leading-relaxed">
        {poet.biography.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-white/80 mb-6 text-[1.05rem] md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
