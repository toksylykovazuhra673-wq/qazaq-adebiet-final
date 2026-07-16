import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import type { Writer } from '@/types/writer';

import WriterBiographyTab from './tabs/WriterBiographyTab';
import WriterTimelineTab from './tabs/WriterTimelineTab';
import WriterWorksTab from './tabs/WriterWorksTab';
import WriterNovelsTab from './tabs/WriterNovelsTab';
import WriterStoriesTab from './tabs/WriterStoriesTab';
import WriterShortStoriesTab from './tabs/WriterShortStoriesTab';
import WriterPlaysTab from './tabs/WriterPlaysTab';
import WriterArticlesTab from './tabs/WriterArticlesTab';
import WriterQuotesTab from './tabs/WriterQuotesTab';
import WriterChronologyTab from './tabs/WriterChronologyTab';
import WriterGalleryTab from './tabs/WriterGalleryTab';
import WriterVideosTab from './tabs/WriterVideosTab';
import WriterAudioTab from './tabs/WriterAudioTab';
import WriterPdfTab from './tabs/WriterPdfTab';
import WriterFactsTab from './tabs/WriterFactsTab';
import WriterTestTab from './tabs/WriterTestTab';

interface WriterDetailTabsProps {
  writer: Writer;
  initialTab: string;
}

const TABS = [
  { id: 'biography', label: 'Өмірбаяны' },
  { id: 'timeline', label: 'Өмір жолы' },
  { id: 'works', label: 'Шығармалары' },
  { id: 'novels', label: 'Романдары' },
  { id: 'stories', label: 'Повестері' },
  { id: 'shortStories', label: 'Әңгімелері' },
  { id: 'plays', label: 'Пьесалары' },
  { id: 'articles', label: 'Мақалалары' },
  { id: 'quotes', label: 'Қанатты сөздері' },
  { id: 'chronology', label: 'Хронология' },
  { id: 'gallery', label: 'Фотогалерея' },
  { id: 'videos', label: 'Бейнематериалдар' },
  { id: 'audio', label: 'Аудиокітаптар' },
  { id: 'pdf', label: 'PDF кітаптар' },
  { id: 'facts', label: 'Қызықты деректер' },
  { id: 'test', label: 'Интерактивті тест' },
];

export default function WriterDetailTabs({ writer, initialTab }: WriterDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setLocation(`/writers/${writer.slug}?tab=${tabId}`, { replace: true });
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="w-full overflow-x-auto hide-scrollbar border-b border-white/10 mb-8 sticky top-20 z-20 bg-[#0a0618]/90 backdrop-blur-xl pt-4">
        <div className="flex w-max min-w-full px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="writerTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'biography' && <WriterBiographyTab writer={writer} />}
            {activeTab === 'timeline' && <WriterTimelineTab writer={writer} />}
            {activeTab === 'works' && <WriterWorksTab writer={writer} />}
            {activeTab === 'novels' && <WriterNovelsTab writer={writer} />}
            {activeTab === 'stories' && <WriterStoriesTab writer={writer} />}
            {activeTab === 'shortStories' && <WriterShortStoriesTab writer={writer} />}
            {activeTab === 'plays' && <WriterPlaysTab writer={writer} />}
            {activeTab === 'articles' && <WriterArticlesTab writer={writer} />}
            {activeTab === 'quotes' && <WriterQuotesTab writer={writer} />}
            {activeTab === 'chronology' && <WriterChronologyTab writer={writer} />}
            {activeTab === 'gallery' && <WriterGalleryTab writer={writer} />}
            {activeTab === 'videos' && <WriterVideosTab writer={writer} />}
            {activeTab === 'audio' && <WriterAudioTab writer={writer} />}
            {activeTab === 'pdf' && <WriterPdfTab writer={writer} />}
            {activeTab === 'facts' && <WriterFactsTab writer={writer} />}
            {activeTab === 'test' && <WriterTestTab writer={writer} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}