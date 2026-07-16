import React from 'react';
import type { BiSheshen } from '@/types/bi';

export default function BiographyTab({ bi }: { bi: BiSheshen }) {
  return (
    <div className="glass-panel p-8 rounded-2xl">
      <h2 className="text-2xl font-serif text-white mb-6">Өмірбаяны</h2>
      <p className="text-lg text-white/80 leading-relaxed whitespace-pre-line">{bi.biography}</p>
    </div>
  );
}
