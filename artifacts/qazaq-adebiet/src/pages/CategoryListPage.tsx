import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { getCompatAuthors } from '@/lib/dataLoader';

export default function CategoryListPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Determine category based on route
  const pathParts = location.split('/');
  const routeCategory = pathParts[1]; // aqyndar, zhazushylar, zhyraudar, kitapkhana
  
  let pageTitle = '';
  let pageDesc = '';
  let filteredAuthors = getCompatAuthors();

  if (routeCategory === 'aqyndar') {
    pageTitle = 'Ақындар';
    pageDesc = 'Қазақтың ұлы ақындары мен жыршылары';
    filteredAuthors = filteredAuthors.filter(a => a.category === 'aqyndar');
  } else if (routeCategory === 'zhazushylar') {
    pageTitle = 'Жазушылар';
    pageDesc = 'Қазақ прозасының майталмандары';
    filteredAuthors = filteredAuthors.filter(a => a.category === 'zhazushylar');
  } else if (routeCategory === 'zhyraudar') {
    pageTitle = 'Жыраулар';
    pageDesc = 'Ежелгі жыраулық дәстүр өкілдері';
    filteredAuthors = filteredAuthors.filter(a => a.category === 'zhyraudar');
  } else if (routeCategory === 'kitapkhana') {
    pageTitle = 'Кітапхана';
    pageDesc = 'Барлық авторлар мен шығармалар';
    // showing all
  }

  // Filter by search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredAuthors = filteredAuthors.filter(a => 
      a.name.toLowerCase().includes(term) || 
      a.description.toLowerCase().includes(term)
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            <span className="heading-underline">{pageTitle}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70"
          >
            {pageDesc}
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12 flex gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Авторды немесе кітапты іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary glass-panel"
            />
          </div>
          <button className="flex items-center justify-center w-12 h-12 rounded-full glass-panel hover:bg-white/10 transition-colors text-white">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuthors.map((author, index) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
            >
              <Link href={`/author/${author.slug}`}>
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center text-center cursor-pointer group">
                  {author.image ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                      <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full mb-4 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                      <span className="text-3xl font-serif text-white">{author.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-primary border border-white/5">
                      {author.categoryLabel}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif text-white mb-1 group-hover:text-primary transition-colors">{author.name}</h3>
                  <p className="text-sm text-accent mb-3">{author.years}</p>
                  
                  <p className="text-sm text-white/60 line-clamp-3 mb-4 flex-1">
                    {author.description}
                  </p>
                  
                  <div className="w-full flex items-center justify-center gap-2 pt-4 border-t border-white/10 text-sm text-white/50 group-hover:text-white/80 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span>{author.works.length} шығарма</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {filteredAuthors.length === 0 && (
          <div className="text-center py-20 text-white/50">
            <p className="text-lg">Нәтиже табылмады.</p>
          </div>
        )}

      </div>
    </div>
  );
}
