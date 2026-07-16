import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function BiographyTab({ author }: Props) {
  const [expanded, setExpanded] = useState(false);
  const accent = CATEGORY_ACCENT[author.category];
  const paragraphs = author.biography.split('\n\n').filter(Boolean);
  const preview = paragraphs.slice(0, 2);
  const rest = paragraphs.slice(2);

  return (
    <div className="space-y-8">
      {/* Biography text */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
        <h2 className={`text-lg font-semibold ${accent} mb-5`}>Өмірбаяны</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
          {preview.map((p, i) => <p key={i}>{p}</p>)}
          {rest.length > 0 && (
            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-0">
                {rest.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>
          )}
        </div>
        {rest.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <><ChevronUp size={16} />Жию</> : <><ChevronDown size={16} />Толығырақ оқу</>}
          </button>
        )}
      </div>

      {/* Tags */}
      {author.tags?.length > 0 && (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-300">Тақырыптар</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {author.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
