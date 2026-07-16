import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

export default function RelatedZhyrau({ zhyrauList }: { zhyrauList: Zhyrau[] }) {
  if (!zhyrauList.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-serif text-white mb-8">Ұқсас жыраулар</h2>
      <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
        {zhyrauList.map((z, i) => (
          <motion.div
            key={z.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="shrink-0 w-44"
          >
            <Link href={`/zhyrau/${z.slug}`} className="flex flex-col items-center text-center glass-card p-5 rounded-2xl hover:border-accent/40 transition-colors group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent/50 transition-colors mb-3">
                {z.photo ? (
                  <img src={z.photo} alt={z.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-600/30 to-violet-700/20 flex items-center justify-center text-2xl font-serif text-white/90">
                    {z.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <p className="font-serif text-white text-sm font-semibold line-clamp-2 group-hover:text-accent transition-colors">{z.fullName}</p>
              <p className="text-accent text-xs mt-1">{z.era}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
