import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import type { Poet } from '@/types/poet';

import BiographyTab from './tabs/BiographyTab';
import TimelineTab from './tabs/TimelineTab';
import WorksTab from './tabs/WorksTab';
import PoemsTab from './tabs/PoemsTab';
import PoemasTab from './tabs/PoemasTab';
import TranslationsTab from './tabs/TranslationsTab';
import QuotesTab from './tabs/QuotesTab';
import GalleryTab from './tabs/GalleryTab';
import VideosTab from './tabs/VideosTab';
import AudioTab from './tabs/AudioTab';
import PdfTab from './tabs/PdfTab';
import FactsTab from './tabs/FactsTab';
import TestTab from './tabs/TestTab';

interface PoetDetailTabsProps {
  poet: Poet;
  initialTab: string;
}

const TABS = [
  { id: 'biography', label: 'Өмірбаяны' },
  { id: 'timeline', label: 'Өмір жолы' },
  { id: 'works', label: 'Шығармалары' },
  { id: 'poems', label: 'Өлеңдері' },
  { id: 'poemas', label: 'Поэмалары' },
  { id: 'translations', label: 'Аудармалары' },
  { id: 'quotes', label: 'Қанатты сөздері' },
  { id: 'gallery', label: 'Фотогалерея' },
  { id: 'videos', label: 'Бейнематериалдар' },
  { id: 'audio', label: 'Аудиокітаптар' },
  { id: 'pdf', label: 'PDF кітаптар' },
  { id: 'facts', label: 'Қызықты деректер' },
  { id: 'test', label: 'Интерактивті тест' },
];

export default function PoetDetailTabs({ poet, initialTab }: PoetDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setLocation(`/poets/${poet.slug}?tab=${tabId}`, { replace: true });
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
                  layoutId="activeTabIndicator"
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
            {activeTab === 'biography' && <BiographyTab poet={poet} />}
            {activeTab === 'timeline' && <TimelineTab poet={poet} />}
            {activeTab === 'works' && <WorksTab poet={poet} />}
            {activeTab === 'poems' && <PoemsTab poet={poet} />}
            {activeTab === 'poemas' && <PoemasTab poet={poet} />}
            {activeTab === 'translations' && <TranslationsTab poet={poet} />}
            {activeTab === 'quotes' && <QuotesTab poet={poet} />}
            {activeTab === 'gallery' && <GalleryTab poet={poet} />}
            {activeTab === 'videos' && <VideosTab poet={poet} />}
            {activeTab === 'audio' && <AudioTab poet={poet} />}
            {activeTab === 'pdf' && <PdfTab poet={poet} />}
            {activeTab === 'facts' && <FactsTab poet={poet} />}
            {activeTab === 'test' && <TestTab poet={poet} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
