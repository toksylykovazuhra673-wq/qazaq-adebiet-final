import React from 'react';
import type { Writer } from '@/types/writer';

export default function WriterNovelsTab({ writer }: { writer: Writer }) {
  if (!writer.novels || writer.novels.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Романдар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {writer.novels.map((novel) => (
        <div key={novel.id} className="glass-card p-5 rounded-xl border border-white/10">
          <h3 className="font-serif text-white text-xl mb-2">{novel.title}</h3>
          <p className="text-accent text-sm mb-3">{novel.year}</p>
          <p className="text-white/70 text-sm line-clamp-3">{novel.description}</p>
        </div>
      ))}
    </div>
  );
}