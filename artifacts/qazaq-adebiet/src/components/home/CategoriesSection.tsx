import React from 'react';
import { motion } from 'framer-motion';
import { Feather, BookOpen, Music, Scale, LampDesk } from 'lucide-react';
import { Link } from 'wouter';
import categoriesData from '@/data/categories.json';

const iconMap: Record<string, React.ReactNode> = {
  'feather': <Feather className="w-6 h-6" />,
  'book-open': <BookOpen className="w-6 h-6" />,
  'music': <Music className="w-6 h-6" />,
  'scale': <Scale className="w-6 h-6" />,
  'lamp': <LampDesk className="w-6 h-6" />
};

export default function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white">
            <span className="heading-underline">Санаттар</span>
          </h2>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
          {categoriesData.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[260px] md:min-w-0 snap-start"
            >
              <Link href={`/${category.id}`}>
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col group relative overflow-hidden">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-colors duration-500" />
                  
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {iconMap[category.icon] || <BookOpen className="w-6 h-6" />}
                  </div>
                  
                  <h3 className="text-xl font-serif text-white mb-2 relative z-10">{category.label}</h3>
                  <p className="text-sm text-violet-200 mb-6 flex-1 relative z-10">{category.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto relative z-10 border-t border-white/10 pt-4">
                    <span className="text-xs font-medium bg-violet-500/10 px-2 py-1 rounded text-violet-200 border border-violet-500/20">
                      {category.count} автор
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Hide scrollbar utility for this section */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
