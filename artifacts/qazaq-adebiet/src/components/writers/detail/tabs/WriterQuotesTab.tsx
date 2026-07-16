import React, { useState } from 'react';
import { Clipboard, Share2, Heart, Check } from 'lucide-react';
import type { Writer, WriterQuote } from '@/types/writer';
import { useToast } from '@/hooks/use-toast';

function WriterQuoteCard({ quote }: { quote: WriterQuote }) {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
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
      <div className="absolute top-[-10px] left-2 text-primary/20 text-8xl font-serif leading-none select-none pointer-events-none">
        &ldquo;
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        <p className="text-xl md:text-2xl font-serif text-white leading-relaxed italic flex-1 mb-8">
          {quote.text}
        </p>

        <div className="flex items-center gap-3 border-t border-white/10 pt-4 mt-auto justify-end">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors border border-white/10 bg-white/5 hover:bg-white/10 ${
              isFavorite ? 'text-red-500' : 'text-white/70'
            }`}
            title="Таңдаулыларға қосу"
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/10"
            title="Көшіру"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/10"
            title="Бөлісу"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WriterQuotesTab({ writer }: { writer: Writer }) {
  if (!writer.quotes || writer.quotes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Қанатты сөздер тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {writer.quotes.map((quote) => (
        <WriterQuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
}