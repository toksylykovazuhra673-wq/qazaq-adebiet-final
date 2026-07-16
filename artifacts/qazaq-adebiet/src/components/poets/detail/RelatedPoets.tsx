import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import type { Poet } from '@/types/poet';

export default function RelatedPoets({ poets }: { poets: Poet[] }) {
  if (!poets || poets.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-3xl font-serif text-white">Сізге ұнауы мүмкін</h3>
        <div className="h-px bg-white/10 flex-1 ml-4 hidden sm:block"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {poets.map((poet, idx) => (
          <motion.div
            key={poet.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={`/poets/${poet.slug}`}
              className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 transition-colors group h-full"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                {poet.photo ? (
                  <img src={poet.photo} alt={poet.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xl font-serif text-white/90">
                    {poet.fullName.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="min-w-0">
                <h4 className="font-serif text-white text-lg font-medium truncate group-hover:text-primary transition-colors">
                  {poet.fullName}
                </h4>
                <p className="text-accent text-sm truncate">
                  {poet.era}
                </p>
                <div className="text-xs text-white/50 mt-1 truncate">
                  {poet.literaryMovement}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
