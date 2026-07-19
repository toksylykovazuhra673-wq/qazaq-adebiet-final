/**
 * WorkPdfReaderPage — full-screen dedicated reader page for a single uploaded
 * poem / story / work PDF stored in localStorage via useWorkPdf.
 *
 * Route: /shygarma/:ownerSlug/:itemId
 */
import { useState } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ZoomIn, ZoomOut, Printer, Download,
  Maximize2, Minimize2, FileText, AlertTriangle,
  ChevronLeft, ChevronRight, Sun, Moon,
} from 'lucide-react';
import { useWorkPdf } from '@/hooks/useWriterPdfs';

/* ── helpers ──────────────────────────────────────────────── */
function prettyItemLabel(itemId: string): string {
  const map: Record<string, string> = {
    poem: 'Өлең', novel: 'Роман', story: 'Повесть',
    shortstory: 'Әңгіме', play: 'Пьеса',
    article: 'Мақала', translation: 'Аударма', longpoem: 'Поэма',
  };
  const prefix = itemId.split('-')[0];
  return map[prefix] ?? 'Шығарма';
}

/* ── Toolbar button ───────────────────────────────────────── */
function TBtn({
  onClick, title, children, active = false, danger = false,
}: {
  onClick?: () => void; title?: string;
  children: React.ReactNode; active?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        danger
          ? 'hover:bg-red-500/20 text-white/50 hover:text-red-400'
          : active
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/25'
          : 'hover:bg-white/10 text-white/60 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function WorkPdfReaderPage() {
  const { ownerSlug, itemId } = useParams<{ ownerSlug: string; itemId: string }>();
  const { entry } = useWorkPdf(ownerSlug ?? '', itemId ?? '');

  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  const isBase64 = entry?.url.startsWith('data:');
  const label = prettyItemLabel(itemId ?? '');

  /* ── Toggle browser fullscreen ── */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  /* ── No entry ── */
  if (!entry) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-6 ${nightMode ? 'bg-[#0a0818]' : 'bg-[#0d0a20]'}`}>
        <AlertTriangle className="w-14 h-14 text-amber-400/50" />
        <p className="text-white/50 text-lg">PDF табылмады</p>
        <p className="text-white/30 text-sm">Алдымен файл жүктеңіз немесе сілтеме қосыңыз.</p>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-white/70 hover:text-white transition-colors border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Артқа
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen flex flex-col ${nightMode ? 'bg-[#0a0818]' : 'bg-[#0d0a20]'}`}
    >
      {/* ── Top bar ── */}
      <div className={`shrink-0 flex items-center gap-3 px-4 py-2.5 border-b ${
        nightMode ? 'bg-black/60 border-white/5' : 'bg-[#08051a]/90 border-white/10'
      } backdrop-blur-md sticky top-0 z-30`}>

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors text-sm shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> Артқа
        </button>

        <div className="w-px h-5 bg-white/10 shrink-0" />

        {/* Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 shrink-0">
            {label}
          </span>
          {isBase64 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
              Жүктелген
            </span>
          )}
          <h1 className="text-white font-semibold text-sm truncate">{entry.title}</h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 shrink-0">
          <TBtn onClick={() => setZoom(z => Math.max(40, z - 10))} title="Кішірейту">
            <ZoomOut className="w-4 h-4" />
          </TBtn>
          <span className="text-white/40 text-xs w-10 text-center select-none">{zoom}%</span>
          <TBtn onClick={() => setZoom(z => Math.min(200, z + 10))} title="Үлкейту">
            <ZoomIn className="w-4 h-4" />
          </TBtn>
          <TBtn onClick={() => setZoom(100)} title="Қалыпты өлшем">
            <span className="text-xs font-mono">1:1</span>
          </TBtn>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <TBtn onClick={() => setNightMode(n => !n)} active={nightMode} title={nightMode ? 'Күндізгі режим' : 'Түнгі режим'}>
            {nightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </TBtn>

          <TBtn onClick={toggleFullscreen} title="Толық экран">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </TBtn>

          <TBtn onClick={() => window.print()} title="Басып шығару">
            <Printer className="w-4 h-4" />
          </TBtn>

          {!isBase64 && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Жаңа қойындыда ашу"
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* ── PDF frame ── */}
      <div className={`flex-1 flex items-start justify-center overflow-auto p-6 ${nightMode ? 'bg-[#080614]' : 'bg-[#0d0a1f]'}`}>
        <motion.div
          key={zoom}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          style={{ width: `${zoom}%`, minWidth: 480, maxWidth: '100%' }}
        >
          <iframe
            src={entry.url}
            title={entry.title}
            className={`w-full rounded-2xl border shadow-2xl ${
              nightMode
                ? 'border-white/5 shadow-black/50'
                : 'border-white/10 shadow-violet-900/20'
            }`}
            style={{
              height: '87vh',
              background: nightMode ? '#1a1a2e' : '#ffffff',
              filter: nightMode ? 'invert(1) hue-rotate(180deg)' : 'none',
            }}
          />
        </motion.div>
      </div>

      {/* ── Bottom info strip ── */}
      <div className={`shrink-0 flex items-center justify-center gap-6 px-6 py-2 border-t text-xs ${
        nightMode ? 'bg-black/40 border-white/5 text-white/25' : 'bg-[#08051a]/80 border-white/8 text-white/30'
      }`}>
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" /> {entry.title}
        </span>
        {entry.addedAt && (
          <span>
            Қосылды: {new Date(entry.addedAt).toLocaleDateString('kk-KZ')}
          </span>
        )}
        {isBase64 && <span className="text-emerald-500/50">● localStorage</span>}
      </div>
    </motion.div>
  );
}
