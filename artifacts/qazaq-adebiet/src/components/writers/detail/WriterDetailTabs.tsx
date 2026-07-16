import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Printer } from 'lucide-react';
import type { Writer } from '@/types/writer';

import WriterBiographyTab    from './tabs/WriterBiographyTab';
import WriterTimelineTab     from './tabs/WriterTimelineTab';
import WriterFamilyTab       from './tabs/WriterFamilyTab';
import WriterEducationTab    from './tabs/WriterEducationTab';
import WriterCareerTab       from './tabs/WriterCareerTab';
import WriterWorksTab        from './tabs/WriterWorksTab';
import WriterNovelsTab       from './tabs/WriterNovelsTab';
import WriterStoriesTab      from './tabs/WriterStoriesTab';
import WriterShortStoriesTab from './tabs/WriterShortStoriesTab';
import WriterPlaysTab        from './tabs/WriterPlaysTab';
import WriterArticlesTab     from './tabs/WriterArticlesTab';
import WriterTranslationsTab from './tabs/WriterTranslationsTab';
import WriterQuotesTab       from './tabs/WriterQuotesTab';
import WriterGalleryTab      from './tabs/WriterGalleryTab';
import WriterPdfTab          from './tabs/WriterPdfTab';
import WriterAudioTab        from './tabs/WriterAudioTab';
import WriterVideosTab       from './tabs/WriterVideosTab';
import WriterAnalysisTab     from './tabs/WriterAnalysisTab';
import WriterInteractiveTab  from './tabs/WriterInteractiveTab';
import WriterOlympiadTab     from './tabs/WriterOlympiadTab';
import WriterFactsTab        from './tabs/WriterFactsTab';
import WriterBibliographyTab from './tabs/WriterBibliographyTab';

const TABS = [
  { id: 'biography',    label: 'Өмірбаяны',             emoji: '📖' },
  { id: 'timeline',     label: 'Хронология',             emoji: '📅' },
  { id: 'family',       label: 'Отбасы',                 emoji: '👨‍👩‍👧' },
  { id: 'education',    label: 'Білімі',                 emoji: '🎓' },
  { id: 'career',       label: 'Қызметтері',             emoji: '💼' },
  { id: 'works',        label: 'Шығармалары',            emoji: '📚' },
  { id: 'shortStories', label: 'Әңгімелері',             emoji: '✍️' },
  { id: 'novels',       label: 'Романдары',              emoji: '📗' },
  { id: 'stories',      label: 'Повестері',              emoji: '📘' },
  { id: 'plays',        label: 'Пьесалары',              emoji: '🎭' },
  { id: 'articles',     label: 'Мақалалары',             emoji: '📄' },
  { id: 'translations', label: 'Аудармалары',            emoji: '🌐' },
  { id: 'quotes',       label: 'Қанатты сөздері',        emoji: '💬' },
  { id: 'gallery',      label: 'Фотогалерея',            emoji: '🖼️' },
  { id: 'pdf',          label: 'PDF',                    emoji: '📑' },
  { id: 'audio',        label: 'Аудиокітаптар',          emoji: '🎧' },
  { id: 'videos',       label: 'Бейне',                  emoji: '🎬' },
  { id: 'analysis',     label: 'Әдеби талдау',           emoji: '📊' },
  { id: 'interactive',  label: 'Интерактив',             emoji: '🎮' },
  { id: 'olympiad',     label: 'Олимпиада',              emoji: '🏆' },
  { id: 'facts',        label: 'Қызықты деректер',       emoji: '💡' },
  { id: 'bibliography', label: 'Әдебиеттер тізімі',     emoji: '📋' },
] as const;

type TabId = typeof TABS[number]['id'];

interface Props {
  writer: Writer;
  initialTab: string;
}

function exportTxt(writer: Writer) {
  const lines = [
    `═══════════════════════════════════════════`,
    `${writer.fullName}`,
    `${writer.birthDate.split('-')[0]} – ${writer.deathDate ? writer.deathDate.split('-')[0] : 'б.з.'}`,
    `═══════════════════════════════════════════`,
    ``,
    `ӨМІРБАЯНЫ`,
    `──────────`,
    writer.biography,
    ``,
    `ҚАНАТТЫ СӨЗДЕРІ`,
    `────────────────`,
    ...writer.quotes.map((q, i) => `${i + 1}. «${q.text}»`),
    ``,
    `ШЫҒАРМАЛАРЫ`,
    `────────────`,
    ...writer.works.map((w) => `• ${w.title} (${w.year}) — ${w.genre}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `${writer.slug}.txt`; a.click();
}

function exportHtml(writer: Writer) {
  const html = `<!DOCTYPE html>
<html lang="kk"><head><meta charset="UTF-8"><title>${writer.fullName}</title>
<style>
  body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #222; }
  h1 { font-size: 2.5rem; margin-bottom: 0.2em; }
  h2 { font-size: 1.4rem; border-bottom: 2px solid #ccc; padding-bottom: 6px; margin-top: 2em; }
  .years { font-size: 1.1rem; color: #666; margin-bottom: 2em; }
  blockquote { font-style: italic; border-left: 4px solid #888; padding-left: 16px; margin: 8px 0; }
  li { margin: 4px 0; }
</style></head><body>
<h1>${writer.fullName}</h1>
<div class="years">${writer.birthDate.split('-')[0]} – ${writer.deathDate ? writer.deathDate.split('-')[0] : 'б.з.'} · ${writer.birthPlace}</div>
<h2>Өмірбаяны</h2>
<p>${writer.biography.replace(/\n/g, '</p><p>')}</p>
<h2>Қанатты сөздері</h2>
${writer.quotes.map((q) => `<blockquote>${q.text}</blockquote>`).join('\n')}
<h2>Шығармалары</h2>
<ul>${writer.works.map((w) => `<li><strong>${w.title}</strong> (${w.year}) — ${w.genre}</li>`).join('')}</ul>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `${writer.slug}.html`; a.click();
}

function exportJson(writer: Writer) {
  const blob = new Blob([JSON.stringify(writer, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `${writer.slug}.json`; a.click();
}

export default function WriterDetailTabs({ writer, initialTab }: Props) {
  const validInitial = TABS.find((t) => t.id === initialTab) ? initialTab as TabId : 'biography';
  const [activeTab, setActiveTab] = useState<TabId>(validInitial);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const valid = TABS.find((t) => t.id === initialTab) ? initialTab as TabId : 'biography';
    setActiveTab(valid);
  }, [initialTab]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setLocation(`/writers/${writer.slug}?tab=${tabId}`, { replace: true });
  };

  return (
    <div className="w-full">
      {/* ── Tab navigation ─────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-slate-950/95 backdrop-blur-xl border-b border-white/8 pt-3">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex w-max min-w-full px-1 gap-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-all duration-200 rounded-t-xl ${
                  activeTab === tab.id
                    ? 'text-white bg-white/6'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/4'
                }`}
              >
                <span className="text-sm">{tab.emoji}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="writerTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Export row */}
        <div className="flex items-center justify-end gap-2 px-4 pb-2 pt-1">
          <span className="text-white/20 text-xs mr-2">Экспорт:</span>
          <button onClick={() => exportTxt(writer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-white/45 hover:text-white text-xs transition-all">
            <FileText size={12} /> TXT
          </button>
          <button onClick={() => exportHtml(writer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-white/45 hover:text-white text-xs transition-all">
            <Download size={12} /> DOC
          </button>
          <button onClick={() => exportJson(writer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-white/45 hover:text-white text-xs transition-all">
            <Download size={12} /> JSON
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-white/45 hover:text-white text-xs transition-all">
            <Printer size={12} /> Басып шығару
          </button>
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────────────────────── */}
      <div className="min-h-[500px] pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            {activeTab === 'biography'    && <WriterBiographyTab    writer={writer} />}
            {activeTab === 'timeline'     && <WriterTimelineTab     writer={writer} />}
            {activeTab === 'family'       && <WriterFamilyTab       writer={writer} />}
            {activeTab === 'education'    && <WriterEducationTab    writer={writer} />}
            {activeTab === 'career'       && <WriterCareerTab       writer={writer} />}
            {activeTab === 'works'        && <WriterWorksTab        writer={writer} />}
            {activeTab === 'shortStories' && <WriterShortStoriesTab writer={writer} />}
            {activeTab === 'novels'       && <WriterNovelsTab       writer={writer} />}
            {activeTab === 'stories'      && <WriterStoriesTab      writer={writer} />}
            {activeTab === 'plays'        && <WriterPlaysTab        writer={writer} />}
            {activeTab === 'articles'     && <WriterArticlesTab     writer={writer} />}
            {activeTab === 'translations' && <WriterTranslationsTab writer={writer} />}
            {activeTab === 'quotes'       && <WriterQuotesTab       writer={writer} />}
            {activeTab === 'gallery'      && <WriterGalleryTab      writer={writer} />}
            {activeTab === 'pdf'          && <WriterPdfTab          writer={writer} />}
            {activeTab === 'audio'        && <WriterAudioTab        writer={writer} />}
            {activeTab === 'videos'       && <WriterVideosTab       writer={writer} />}
            {activeTab === 'analysis'     && <WriterAnalysisTab     writer={writer} />}
            {activeTab === 'interactive'  && <WriterInteractiveTab  writer={writer} />}
            {activeTab === 'olympiad'     && <WriterOlympiadTab     writer={writer} />}
            {activeTab === 'facts'        && <WriterFactsTab        writer={writer} />}
            {activeTab === 'bibliography' && <WriterBibliographyTab writer={writer} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
