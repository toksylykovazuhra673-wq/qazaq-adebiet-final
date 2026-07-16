import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import type { Writer } from '@/types/writer';

export default function RelatedWriters({ writers }: { writers: Writer[] }) {
  if (!writers || writers.length === 0) return null;

  return (
    <div className="border-t border-white/10 pt-16 pb-12">
      <h2 className="text-3xl font-serif text-white mb-8 text-center md:text-left">Ұқсас жазушылар</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {writers.map((writer, index) => (
          <motion.div
            key={writer.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/writers/${writer.slug}`} className="block group">
              <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 mb-4 bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-2xl font-serif text-white">
                  {writer.photo ? (
                    <img src={writer.photo} alt={writer.fullName} className="w-full h-full object-cover" />
                  ) : (
                    writer.fullName.charAt(0)
                  )}
                </div>
                <h3 className="font-serif text-white font-medium group-hover:text-primary transition-colors line-clamp-1 mb-1">
                  {writer.fullName}
                </h3>
                <p className="text-accent text-xs">
                  {writer.era}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}