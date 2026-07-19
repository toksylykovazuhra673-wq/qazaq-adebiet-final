import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { getFeaturedAuthors } from '@/lib/dataLoader';

export default function FeaturedAuthorsSection() {
  const featuredAuthors = getFeaturedAuthors(6);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              <span className="heading-underline">Танымал авторлар</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/kitapkhana" className="flex items-center gap-2 text-primary hover:text-white transition-colors group">
              <span className="font-medium text-sm">Барлығын көру</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAuthors.map((author, index) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center text-center group">
                {author.image ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-5 border-2 border-white/10 group-hover:border-primary transition-colors">
                    <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full mb-5 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-white/10 flex items-center justify-center group-hover:border-primary transition-colors">
                    <span className="text-4xl font-serif text-white">{author.name.charAt(0)}</span>
                  </div>
                )}
                
                <h3 className="text-xl font-serif text-white mb-1 group-hover:text-primary transition-colors">
                  {author.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="text-primary">{author.categoryLabel}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-accent">{author.years}</span>
                </div>
                
                <p className="text-sm text-white/60 mb-6 line-clamp-2 px-2">
                  {author.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-white/10 w-full">
                  <Link 
                    href={`/author/${author.slug}`}
                    className="inline-block w-full py-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-white text-white/80 transition-colors text-sm font-medium"
                  >
                    Толығырақ
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
