import React from 'react';
import type { Writer } from '@/types/writer';

export default function WriterStoriesTab({ writer }: { writer: Writer }) {
  if (!writer.stories || writer.stories.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Повестер тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {writer.stories.map((story) => (
        <div key={story.id} className="glass-card p-5 rounded-xl border border-white/10">
          <h3 className="font-serif text-white text-xl mb-2">{story.title}</h3>
          <p className="text-accent text-sm mb-3">{story.year}</p>
          <p className="text-white/70 text-sm line-clamp-3">{story.description}</p>
        </div>
      ))}
    </div>
  );
}