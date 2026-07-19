import React from 'react';
import { FileText } from 'lucide-react';
import type { Writer } from '@/types/writer';
import ItemPdfButton from '@/components/shared/ItemPdfButton';

export default function WriterArticlesTab({ writer }: { writer: Writer }) {
  if (!writer.articles || writer.articles.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Мақалалар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {writer.articles.map((article) => (
        <div key={article.id} className="glass-card p-5 rounded-xl border border-white/10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1">
            <FileText className="w-5 h-5 text-white/50" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-white text-xl mb-1">{article.title}</h3>
            <p className="text-accent text-sm mb-2">{article.year}</p>
            <p className="text-white/70 text-sm">{article.description}</p>
            <ItemPdfButton
              ownerSlug={writer.slug}
              itemId={`article-${article.id}`}
              itemTitle={article.title}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
