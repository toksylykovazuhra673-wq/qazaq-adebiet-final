import React from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, MapPin, Calendar, LayoutGrid } from 'lucide-react';
import { getAuthorBySlug } from '@/lib/dataLoader';
import worksData from '@/data/works.json';
import { Work } from '@/types';

export default function AuthorDetailPage() {
  const { slug } = useParams();
  
  const author = getAuthorBySlug(slug ?? '');
  const authorWorks = (worksData as Work[]).filter(
    (w) => w.authorName === author?.fullName || w.authorName === author?.name
  );

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Автор табылмады</h1>
          <Link href="/" className="text-primary hover:underline">Басты бетке қайту</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Back Button */}
        <Link 
          href={`/${author.category}`} 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Кері қайту</span>
        </Link>

        {/* Hero Profile Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            {/* Avatar */}
            {author.image ? (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl shadow-black/50">
                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-white/10 shrink-0 flex items-center justify-center shadow-2xl shadow-black/50">
                <span className="text-6xl font-serif text-white">{author.name.charAt(0)}</span>
              </div>
            )}
            
            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-primary border border-white/10 text-sm font-medium mb-4">
                {author.categoryLabel}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
                {author.name}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-white/70 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{author.years}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{author.birthplace}</span>
                </div>
              </div>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
                {author.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Col: Sidebar / Extra Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" />
                Қысқаша мәлімет
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-white/50 mb-1">Санаты</div>
                  <div className="text-white">{author.categoryLabel}</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Туған жері</div>
                  <div className="text-white">{author.birthplace}</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Шығармаларының саны</div>
                  <div className="text-white">{authorWorks.length}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Col: Works */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-serif text-white mb-8 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                Негізгі шығармалары
              </h2>
              
              <div className="space-y-4">
                {authorWorks.length > 0 ? (
                  authorWorks.map((work, idx) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="glass-panel p-6 rounded-2xl group hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-3">
                        <h4 className="text-xl font-serif text-white group-hover:text-primary transition-colors">
                          {work.title}
                        </h4>
                        <div className="flex items-center gap-3 shrink-0 text-xs">
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                            {work.genre}
                          </span>
                          <span className="text-accent">{work.year}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white/60">
                        {work.description}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-panel p-8 rounded-2xl text-center text-white/50">
                    Бұл автордың шығармалары әлі қосылмаған.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
