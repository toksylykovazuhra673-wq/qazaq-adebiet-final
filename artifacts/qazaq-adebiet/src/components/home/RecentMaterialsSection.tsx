import React from 'react';
import { motion } from 'framer-motion';
import { Book, Target, Gamepad2, Calendar } from 'lucide-react';
import recentData from '@/data/recentMaterials.json';
import { RecentMaterial } from '@/types';

const getIcon = (type: string) => {
  switch (type) {
    case 'work': return <Book className="w-5 h-5" />;
    case 'test': return <Target className="w-5 h-5" />;
    case 'game': return <Gamepad2 className="w-5 h-5" />;
    default: return <Book className="w-5 h-5" />;
  }
};

const getColorClass = (type: string) => {
  switch (type) {
    case 'work': return 'text-primary bg-primary/10 border-primary/20';
    case 'test': return 'text-accent bg-accent/10 border-accent/20';
    case 'game': return 'text-green-400 bg-green-400/10 border-green-400/20';
    default: return 'text-white bg-white/10 border-white/20';
  }
};

export default function RecentMaterialsSection() {
  return (
    <section className="py-20 relative bg-black/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white">
            <span className="heading-underline">Соңғы қосылған материалдар</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(recentData as RecentMaterial[]).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel rounded-xl p-4 md:p-6 flex gap-4 items-start group hover:bg-white/10 transition-colors cursor-pointer border border-white/5 hover:border-white/20"
            >
              <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${getColorClass(item.type)}`}>
                {getIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h3 className="font-serif text-lg text-white truncate pr-4 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                
                {item.author && (
                  <p className="text-sm text-primary mb-2">{item.author}</p>
                )}
                
                <p className="text-sm text-white/50 line-clamp-1 mb-3">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.addedDate).toLocaleDateString('kk-KZ')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
