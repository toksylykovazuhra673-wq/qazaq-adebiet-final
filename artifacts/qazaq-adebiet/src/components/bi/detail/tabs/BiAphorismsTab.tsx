import React, { useState } from 'react';
import { Copy, Share2, Heart, Check } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

function AphorismCard({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      copy();
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 border border-white/8 hover:border-teal-500/25 transition-colors group">
      <div className="flex items-start gap-4">
        <span className="text-4xl font-serif text-teal-500/25 leading-none select-none shrink-0 mt-1">
          «
        </span>
        <div className="flex-1">
          <p className="text-white/85 text-lg leading-relaxed font-serif">{text}</p>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-white/8"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Көшірілді' : 'Көшіру'}
            </button>
            <button
              onClick={share}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-white/8"
            >
              <Share2 className="w-3.5 h-3.5" />
              Бөлісу
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                liked
                  ? 'bg-red-500/15 text-red-400 border-red-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border-white/8'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-400' : ''}`} />
              {liked ? 'Сақталды' : 'Сақтау'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BiAphorismsTab({ bi }: { bi: BiSheshen }) {
  if (!bi.aphorisms || bi.aphorisms.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Нақыл сөздер жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bi.aphorisms.map((a, i) => (
        <AphorismCard key={a.id} text={a.text} index={i} />
      ))}
    </div>
  );
}
