import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, Users, GraduationCap, Briefcase, Library,
  FileText, ScrollText, BookMarked, AlignLeft, Microscope, Newspaper,
  Search, MessageCircle, Quote, Star, Image, Lightbulb, FileType,
  Headphones, Video, Trophy, UserCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

// Tab components
import BiographyTab from './tabs/BiographyTab';
import ChronologyTab from './tabs/ChronologyTab';
import FamilyTab from './tabs/FamilyTab';
import EducationTab from './tabs/EducationTab';
import CareerTab from './tabs/CareerTab';
import WorksTab from './tabs/WorksTab';
import PoemsTab from './tabs/PoemsTab';
import LongPoemsTab from './tabs/LongPoemsTab';
import NovelsTab from './tabs/NovelsTab';
import StoriesTab from './tabs/StoriesTab';
import ScienceTab from './tabs/ScienceTab';
import ArticlesTab from './tabs/ArticlesTab';
import ResearchTab from './tabs/ResearchTab';
import OratoryTab from './tabs/OratoryTab';
import ProverbsTab from './tabs/ProverbsTab';
import QuotesTab from './tabs/QuotesTab';
import GalleryTab from './tabs/GalleryTab';
import FactsTab from './tabs/FactsTab';
import PdfTab from './tabs/PdfTab';
import AudioTab from './tabs/AudioTab';
import VideoTab from './tabs/VideoTab';
import QuizTab from './tabs/QuizTab';
import RelatedAuthorsTab from './tabs/RelatedAuthorsTab';

interface TabDef {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabDef[] = [
  { id: 'biography',   label: 'Өмірбаяны',        icon: <BookOpen size={15} /> },
  { id: 'chronology',  label: 'Хронология',        icon: <Clock size={15} /> },
  { id: 'family',      label: 'Отбасы',            icon: <Users size={15} /> },
  { id: 'education',   label: 'Білімі',            icon: <GraduationCap size={15} /> },
  { id: 'career',      label: 'Қызметтері',        icon: <Briefcase size={15} /> },
  { id: 'works',       label: 'Шығармалары',       icon: <Library size={15} /> },
  { id: 'poems',       label: 'Өлеңдері',          icon: <FileText size={15} /> },
  { id: 'longpoems',   label: 'Поэмалары',         icon: <ScrollText size={15} /> },
  { id: 'novels',      label: 'Романдары',         icon: <BookMarked size={15} /> },
  { id: 'stories',     label: 'Әңгімелері',        icon: <AlignLeft size={15} /> },
  { id: 'science',     label: 'Ғылыми еңбектері',  icon: <Microscope size={15} /> },
  { id: 'articles',    label: 'Мақалалары',        icon: <Newspaper size={15} /> },
  { id: 'research',    label: 'Зерттеулері',       icon: <Search size={15} /> },
  { id: 'oratory',     label: 'Шешендік сөздері',  icon: <MessageCircle size={15} /> },
  { id: 'proverbs',    label: 'Нақыл сөздері',     icon: <Quote size={15} /> },
  { id: 'quotes',      label: 'Қанатты сөздері',   icon: <Star size={15} /> },
  { id: 'gallery',     label: 'Фотогалерея',       icon: <Image size={15} /> },
  { id: 'facts',       label: 'Қызықты деректер',  icon: <Lightbulb size={15} /> },
  { id: 'pdf',         label: 'PDF',               icon: <FileType size={15} /> },
  { id: 'audio',       label: 'Аудио',             icon: <Headphones size={15} /> },
  { id: 'video',       label: 'Бейне',             icon: <Video size={15} /> },
  { id: 'quiz',        label: 'Викторина',         icon: <Trophy size={15} /> },
  { id: 'related',     label: 'Ұқсас авторлар',   icon: <UserCheck size={15} /> },
];

interface Props {
  author: UniversalAuthor;
}

export default function UniversalAuthorTabs({ author }: Props) {
  const [activeTab, setActiveTab] = useState('biography');
  const navRef = useRef<HTMLDivElement>(null);
  const accent = CATEGORY_ACCENT[author.category];

  // Scroll active tab into view
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector('[data-active="true"]') as HTMLElement;
    if (active) {
      active.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    }
  }, [activeTab]);

  const scroll = (dir: 'left' | 'right') => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-6">
      {/* Tab navigation */}
      <div className="relative bg-gray-900/60 backdrop-blur-sm border-b border-white/5 sticky top-0 z-20">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-gray-900 to-transparent flex items-center"
        >
          <ChevronLeft size={18} className="text-gray-400" />
        </button>
        <div
          ref={navRef}
          className="flex overflow-x-auto scrollbar-hide px-8 py-1 gap-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-active={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0
                  ${isActive
                    ? `${accent} border-b-2 border-current bg-white/5`
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-gray-900 to-transparent flex items-center"
        >
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'biography'  && <BiographyTab author={author} />}
            {activeTab === 'chronology' && <ChronologyTab author={author} />}
            {activeTab === 'family'     && <FamilyTab author={author} />}
            {activeTab === 'education'  && <EducationTab author={author} />}
            {activeTab === 'career'     && <CareerTab author={author} />}
            {activeTab === 'works'      && <WorksTab author={author} />}
            {activeTab === 'poems'      && <PoemsTab author={author} />}
            {activeTab === 'longpoems'  && <LongPoemsTab author={author} />}
            {activeTab === 'novels'     && <NovelsTab author={author} />}
            {activeTab === 'stories'    && <StoriesTab author={author} />}
            {activeTab === 'science'    && <ScienceTab author={author} />}
            {activeTab === 'articles'   && <ArticlesTab author={author} />}
            {activeTab === 'research'   && <ResearchTab author={author} />}
            {activeTab === 'oratory'    && <OratoryTab author={author} />}
            {activeTab === 'proverbs'   && <ProverbsTab author={author} />}
            {activeTab === 'quotes'     && <QuotesTab author={author} />}
            {activeTab === 'gallery'    && <GalleryTab author={author} />}
            {activeTab === 'facts'      && <FactsTab author={author} />}
            {activeTab === 'pdf'        && <PdfTab author={author} />}
            {activeTab === 'audio'      && <AudioTab author={author} />}
            {activeTab === 'video'      && <VideoTab author={author} />}
            {activeTab === 'quiz'       && <QuizTab author={author} />}
            {activeTab === 'related'    && <RelatedAuthorsTab author={author} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
