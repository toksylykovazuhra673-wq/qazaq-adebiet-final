import React, { useState } from 'react';
import { Clipboard, Share2, Check } from 'lucide-react';
import type { Poet, PoetQuote } from '@/types/poet';
import { useToast } from '@/hooks/use-toast';

function QuoteCard({ quote }: { quote: PoetQuote }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(quote.text);
    setCopied(true);
    toast({
      title: "Көшірілді!",
      description: "Қанатты сөз алмасу буферіне сақталды.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Қанатты сөз',
          text: `«${quote.text}»`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
      <div className="absolute top-[-10px] left-2 text-primary/10 text-9xl font-serif leading-none select-none pointer-events-none">
        &ldquo;
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        <p className="text-xl md:text-2xl font-serif text-white leading-relaxed italic flex-1 mb-8">
          {quote.text}
        </p>

        <div className="flex items-center gap-3 border-t border-white/10 pt-4 mt-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
            {copied ? 'Көшірілді' : 'Көшіру'}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Бөлісу
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuotesTab({ poet }: { poet: Poet }) {
  if (!poet.quotes || poet.quotes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Қанатты сөздер тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {poet.quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
}
