import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Educator } from '@/types/educator';

import EducatorBiographyTab from './tabs/EducatorBiographyTab';
import EducatorTimelineTab from './tabs/EducatorTimelineTab';
import EducatorScienceTab from './tabs/EducatorScienceTab';
import EducatorBooksTab from './tabs/EducatorBooksTab';
import EducatorPoemsTab from './tabs/EducatorPoemsTab';
import EducatorArticlesTab from './tabs/EducatorArticlesTab';
import EducatorResearchTab from './tabs/EducatorResearchTab';
import EducatorLettersTab from './tabs/EducatorLettersTab';
import EducatorQuotesTab from './tabs/EducatorQuotesTab';
import EducatorChronologyTab from './tabs/EducatorChronologyTab';
import EducatorGalleryTab from './tabs/EducatorGalleryTab';
import EducatorVideosTab from './tabs/EducatorVideosTab';
import EducatorAudioTab from './tabs/EducatorAudioTab';
import EducatorPdfTab from './tabs/EducatorPdfTab';
import EducatorFactsTab from './tabs/EducatorFactsTab';
import EducatorTestTab from './tabs/EducatorTestTab';

interface Props {
  educator: Educator;
  initialTab: string;
}

const TABS = [
  { id: 'biography',   label: 'Өмірбаяны',        emoji: '📖' },
  { id: 'timeline',    label: 'Өмір жолы',         emoji: '⏳' },
  { id: 'works',       label: 'Ғылыми еңбектері',  emoji: '🔬' },
  { id: 'books',       label: 'Кітаптары',          emoji: '📚' },
  { id: 'poems',       label: 'Өлеңдері',           emoji: '🖊️' },
  { id: 'articles',    label: 'Мақалалары',         emoji: '📰' },
  { id: 'research',    label: 'Зерттеулері',        emoji: '🔭' },
  { id: 'letters',     label: 'Хаттары',            emoji: '✉️' },
  { id: 'quotes',      label: 'Дəйексөздері',       emoji: '💬' },
  { id: 'chronology',  label: 'Хронология',         emoji: '📅' },
  { id: 'gallery',     label: 'Фотогалерея',        emoji: '🖼️' },
  { id: 'videos',      label: 'Бейнематериалдар',   emoji: '🎬' },
  { id: 'audio',       label: 'Аудио',              emoji: '🎧' },
  { id: 'pdf',         label: 'PDF',                emoji: '📄' },
  { id: 'facts',       label: 'Қызықты деректер',   emoji: '💡' },
  { id: 'test',        label: 'Интерактивті тест',  emoji: '📝' },
];

export default function EducatorDetailTabs({ educator, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab || 'biography');
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => { setActiveTab(initialTab || 'biography'); }, [initialTab]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLButtonElement>(`[data-tab-id="${activeTab}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener('scroll', updateScroll);
  }, []);

  const scrollBy = (dir: -1 | 1) =>
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setLocation(`/educators/${educator.slug}?tab=${id}`, { replace: true });
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="sticky top-[64px] z-20 bg-[#0a0618]/95 backdrop-blur-xl border-b border-white/10 mb-8">
        <div className="relative">
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
              >
                <div className="w-14 h-full bg-gradient-to-r from-[#0a0618] to-transparent pointer-events-none absolute" />
                <button
                  onClick={() => scrollBy(-1)}
                  className="relative z-10 ml-1 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={scrollRef} className="flex overflow-x-auto px-2 pt-3" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeTab === tab.id ? 'text-white' : 'text-white/45 hover:text-white/80'
                }`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="educatorTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-500 rounded-t-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {canScrollRight && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
              >
                <div className="w-14 h-full bg-gradient-to-l from-[#0a0618] to-transparent pointer-events-none absolute right-0" />
                <button
                  onClick={() => scrollBy(1)}
                  className="relative z-10 mr-1 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            {activeTab === 'biography'  && <EducatorBiographyTab   educator={educator} />}
            {activeTab === 'timeline'   && <EducatorTimelineTab     educator={educator} />}
            {activeTab === 'works'      && <EducatorScienceTab      educator={educator} />}
            {activeTab === 'books'      && <EducatorBooksTab        educator={educator} />}
            {activeTab === 'poems'      && <EducatorPoemsTab        educator={educator} />}
            {activeTab === 'articles'   && <EducatorArticlesTab     educator={educator} />}
            {activeTab === 'research'   && <EducatorResearchTab     educator={educator} />}
            {activeTab === 'letters'    && <EducatorLettersTab      educator={educator} />}
            {activeTab === 'quotes'     && <EducatorQuotesTab       educator={educator} />}
            {activeTab === 'chronology' && <EducatorChronologyTab   educator={educator} />}
            {activeTab === 'gallery'    && <EducatorGalleryTab      educator={educator} />}
            {activeTab === 'videos'     && <EducatorVideosTab       educator={educator} />}
            {activeTab === 'audio'      && <EducatorAudioTab        educator={educator} />}
            {activeTab === 'pdf'        && <EducatorPdfTab          educator={educator} />}
            {activeTab === 'facts'      && <EducatorFactsTab        educator={educator} />}
            {activeTab === 'test'       && <EducatorTestTab         educator={educator} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
