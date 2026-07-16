import React from 'react';
import type { Writer } from '@/types/writer';

export default function WriterBiographyTab({ writer }: { writer: Writer }) {
  if (!writer.biography) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Өмірбаян мәліметтері әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 rounded-2xl text-lg text-white/80 leading-relaxed whitespace-pre-line max-w-4xl mx-auto">
      {writer.biography}
    </div>
  );
}