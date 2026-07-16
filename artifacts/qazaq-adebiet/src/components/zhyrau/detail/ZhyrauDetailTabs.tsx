import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  { id: 'biography',   label: 'Өмірбаяны',          emoji: '📖' },
  { id: 'timeline',    label: 'Өмір жолы',           emoji: '⏳' },
  { id: 'tolgau',      label: 'Толғаулары',          emoji: '📜' },
  { id: 'poems',       label: 'Жырлары',             emoji: '✍️' },
  { id: 'quotes',      label: 'Нақыл сөздері',       emoji: '💬' },
  { id: 'sayings',     label: 'Қанатты сөздері',     emoji: '🦅' },
  { id: 'historical',  label: 'Тарихи оқиғалар',    emoji: '🏛️' },
  { id: 'chronology',  label: 'Хронология',          emoji: '📅' },
  { id: 'khanship',    label: 'Хандықпен байланысы', emoji: '👑' },
  { id: 'gallery',     label: 'Фотогалерея',         emoji: '🖼️' },
  { id: 'videos',      label: 'Бейнематериалдар',    emoji: '🎬' },
  { id: 'audio',       label: 'Аудио жазбалар',      emoji: '🎧' },
  { id: 'pdf',         label: 'PDF кітаптар',        emoji: '📄' },
  { id: 'facts',       label: 'Қызықты деректер',    emoji: '💡' },
  { id: 'test',        label: 'Интерактивті тест',   emoji: '📝' },
  { id: 'map',         label: 'Карта',               emoji: '🗺️' },
];

export default function ZhyrauDetailTabs({ zhyrau, initialTab }: ZhyrauDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'biography');
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab || 'biography');
  }, [initialTab]);

  // Scroll active tab into view whenever it changes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLButtonElement>(
      `[data-tab-id="${activeTab}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scrollBy = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setLocation(`/zhyrau/${zhyrau.slug}?tab=${tabId}`, { replace: true });
  };

  return (
    <div className="w-full">
      {/* ── Tab Navigation ── */}
      <div className="sticky top-[64px] z-20 bg-[#0a0618]/95 backdrop-blur-xl border-b border-white/10 mb-8">
        <div className="relative">
          {/* Left fade + arrow */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
              >
                <div className="w-16 h-full bg-gradient-to-r from-[#0a0618] to-transparent pointer-events-none absolute" />
                <button
                  onClick={() => scrollBy(-1)}
                  className="relative z-10 ml-1 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable tab list */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide px-2 pt-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/45 hover:text-white/80'
                }`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="zhyrauTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right fade + arrow */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
              >
                <div className="w-16 h-full bg-gradient-to-l from-[#0a0618] to-transparent pointer-events-none absolute right-0" />
                <button
                  onClick={() => scrollBy(1)}
                  className="relative z-10 mr-1 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Tab Content ── */}
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
