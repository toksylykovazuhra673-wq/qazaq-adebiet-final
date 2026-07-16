import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import type { Zhyrau } from '@/types/zhyrau';

import ZhyrauBiographyTab from './tabs/ZhyrauBiographyTab';
import ZhyrauTimelineTab from './tabs/ZhyrauTimelineTab';
import ZhyrauTolgauTab from './tabs/ZhyrauTolgauTab';
import ZhyrauPoemsTab from './tabs/ZhyrauPoemsTab';
import ZhyrauQuotesTab from './tabs/ZhyrauQuotesTab';
import ZhyrauSayingsTab from './tabs/ZhyrauSayingsTab';
import ZhyrauHistoricalTab from './tabs/ZhyrauHistoricalTab';
import ZhyrauChronologyTab from './tabs/ZhyrauChronologyTab';
import ZhyrauKhanshipTab from './tabs/ZhyrauKhanshipTab';
import ZhyrauGalleryTab from './tabs/ZhyrauGalleryTab';
import ZhyrauVideosTab from './tabs/ZhyrauVideosTab';
import ZhyrauAudioTab from './tabs/ZhyrauAudioTab';
import ZhyrauPdfTab from './tabs/ZhyrauPdfTab';
import ZhyrauFactsTab from './tabs/ZhyrauFactsTab';
import ZhyrauTestTab from './tabs/ZhyrauTestTab';
import ZhyrauMapTab from './tabs/ZhyrauMapTab';

interface ZhyrauDetailTabsProps {
  zhyrau: Zhyrau;
  initialTab: string;
}

const TABS = [
  { id: 'biography',   label: 'Өмірбаяны' },
  { id: 'timeline',    label: 'Өмір жолы' },
  { id: 'tolgau',      label: 'Толғаулары' },
  { id: 'poems',       label: 'Жырлары' },
  { id: 'quotes',      label: 'Нақыл сөздері' },
  { id: 'sayings',     label: 'Қанатты сөздері' },
  { id: 'historical',  label: 'Тарихи оқиғалар' },
  { id: 'chronology',  label: 'Хронология' },
  { id: 'khanship',    label: 'Хандықпен байланысы' },
  { id: 'gallery',     label: 'Фотогалерея' },
  { id: 'videos',      label: 'Бейнематериалдар' },
  { id: 'audio',       label: 'Аудио жазбалар' },
  { id: 'pdf',         label: 'PDF кітаптар' },
  { id: 'facts',       label: 'Қызықты деректер' },
  { id: 'test',        label: 'Интерактивті тест' },
  { id: 'map',         label: 'Карта' },
];

export default function ZhyrauDetailTabs({ zhyrau, initialTab }: ZhyrauDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'biography');
  const [, setLocation] = useLocation();

  useEffect(() => {
    setActiveTab(initialTab || 'biography');
  }, [initialTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setLocation(`/zhyrau/${zhyrau.slug}?tab=${tabId}`, { replace: true });
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
                  layoutId="zhyrauTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
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
            {activeTab === 'biography'  && <ZhyrauBiographyTab  zhyrau={zhyrau} />}
            {activeTab === 'timeline'   && <ZhyrauTimelineTab   zhyrau={zhyrau} />}
            {activeTab === 'tolgau'     && <ZhyrauTolgauTab     zhyrau={zhyrau} />}
            {activeTab === 'poems'      && <ZhyrauPoemsTab      zhyrau={zhyrau} />}
            {activeTab === 'quotes'     && <ZhyrauQuotesTab     zhyrau={zhyrau} />}
            {activeTab === 'sayings'    && <ZhyrauSayingsTab    zhyrau={zhyrau} />}
            {activeTab === 'historical' && <ZhyrauHistoricalTab zhyrau={zhyrau} />}
            {activeTab === 'chronology' && <ZhyrauChronologyTab zhyrau={zhyrau} />}
            {activeTab === 'khanship'   && <ZhyrauKhanshipTab   zhyrau={zhyrau} />}
            {activeTab === 'gallery'    && <ZhyrauGalleryTab    zhyrau={zhyrau} />}
            {activeTab === 'videos'     && <ZhyrauVideosTab     zhyrau={zhyrau} />}
            {activeTab === 'audio'      && <ZhyrauAudioTab      zhyrau={zhyrau} />}
            {activeTab === 'pdf'        && <ZhyrauPdfTab        zhyrau={zhyrau} />}
            {activeTab === 'facts'      && <ZhyrauFactsTab      zhyrau={zhyrau} />}
            {activeTab === 'test'       && <ZhyrauTestTab       zhyrau={zhyrau} />}
            {activeTab === 'map'        && <ZhyrauMapTab        zhyrau={zhyrau} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
