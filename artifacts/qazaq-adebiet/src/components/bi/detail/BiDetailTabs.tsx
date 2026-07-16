import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';

import BiographyTab from './tabs/BiographyTab';
import TimelineTab from './tabs/BiTimelineTab';
import OratoryTab from './tabs/BiOratoryTab';
import AphorismsTab from './tabs/BiAphorismsTab';
import CourtCasesTab from './tabs/BiCourtCasesTab';
import DiplomacyTab from './tabs/BiDiplomacyTab';
import HistoricalTab from './tabs/BiHistoricalTab';
import ChronologyTab from './tabs/BiChronologyTab';
import KhanRoleTab from './tabs/BiKhanRoleTab';
import GalleryTab from './tabs/BiGalleryTab';
import VideosTab from './tabs/BiVideosTab';
import AudioTab from './tabs/BiAudioTab';
import PdfTab from './tabs/BiPdfTab';
import FactsTab from './tabs/BiFactsTab';
import TestTab from './tabs/BiTestTab';
import MapTab from './tabs/BiMapTab';

interface Props {
  bi: BiSheshen;
  initialTab: string;
}

const TABS = [
  { id: 'biography',  label: 'Өмірбаяны',             emoji: '📖' },
  { id: 'timeline',   label: 'Өмір жолы',              emoji: '⏳' },
  { id: 'oratory',    label: 'Шешендік сөздері',       emoji: '⚖️' },
  { id: 'aphorisms',  label: 'Нақыл сөздері',          emoji: '💬' },
  { id: 'courtcases', label: 'Билік айтқан даулары',   emoji: '🏛️' },
  { id: 'diplomacy',  label: 'Елшілік қызметі',        emoji: '🤝' },
  { id: 'historical', label: 'Тарихи оқиғалар',        emoji: '📜' },
  { id: 'chronology', label: 'Хронология',             emoji: '📅' },
  { id: 'khanrole',   label: 'Қазақ хандығындағы рөлі', emoji: '👑' },
  { id: 'gallery',    label: 'Фотогалерея',            emoji: '🖼️' },
  { id: 'videos',     label: 'Бейнематериалдар',       emoji: '🎬' },
  { id: 'audio',      label: 'Аудио',                  emoji: '🎧' },
  { id: 'pdf',        label: 'PDF кітаптар',           emoji: '📄' },
  { id: 'facts',      label: 'Қызықты деректер',       emoji: '💡' },
  { id: 'test',       label: 'Интерактивті тест',      emoji: '📝' },
  { id: 'map',        label: 'Қазақстан картасы',      emoji: '🗺️' },
];

export default function BiDetailTabs({ bi, initialTab }: Props) {
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
    setLocation(`/bi-sheshender/${bi.slug}?tab=${id}`, { replace: true });
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
                <button onClick={() => scrollBy(-1)} className="relative z-10 ml-1 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors">
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
                    layoutId="biTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500 rounded-t-full"
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
                <button onClick={() => scrollBy(1)} className="relative z-10 mr-1 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors">
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
            {activeTab === 'biography'  && <BiographyTab  bi={bi} />}
            {activeTab === 'timeline'   && <TimelineTab   bi={bi} />}
            {activeTab === 'oratory'    && <OratoryTab    bi={bi} />}
            {activeTab === 'aphorisms'  && <AphorismsTab  bi={bi} />}
            {activeTab === 'courtcases' && <CourtCasesTab bi={bi} />}
            {activeTab === 'diplomacy'  && <DiplomacyTab  bi={bi} />}
            {activeTab === 'historical' && <HistoricalTab bi={bi} />}
            {activeTab === 'chronology' && <ChronologyTab bi={bi} />}
            {activeTab === 'khanrole'   && <KhanRoleTab   bi={bi} />}
            {activeTab === 'gallery'    && <GalleryTab    bi={bi} />}
            {activeTab === 'videos'     && <VideosTab     bi={bi} />}
            {activeTab === 'audio'      && <AudioTab      bi={bi} />}
            {activeTab === 'pdf'        && <PdfTab        bi={bi} />}
            {activeTab === 'facts'      && <FactsTab      bi={bi} />}
            {activeTab === 'test'       && <TestTab       bi={bi} />}
            {activeTab === 'map'        && <MapTab        bi={bi} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
