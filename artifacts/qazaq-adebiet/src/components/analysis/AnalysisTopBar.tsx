import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, Share2, Download, Printer, Settings,
  FileText, FileJson, FileCode, BookOpen, ChevronDown,
} from 'lucide-react';
import { useLocation } from 'wouter';
import type { Analysis } from '@/types/analysis';

// ── Export helpers ───────────────────────────────────────────
function exportTxt(a: Analysis) {
  const lines = [
    a.title, `Автор: ${a.author}`, `Кезең: ${a.period}`, `Жанр: ${a.genre}`, '',
    '=== ТАҚЫРЫП ===', a.theme, '',
    '=== ИДЕЯ ===', a.idea, '',
    '=== НЕГІЗГІ ОЙ ===', a.mainThought, '',
    '=== ҚЫЗЫҚТЫ ДЕРЕКТЕР ===',
    ...a.interestingFacts.map((f, i) => `${i + 1}. ${f}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: `${a.workSlug}.txt` }).click();
  URL.revokeObjectURL(url);
}

function exportJson(a: Analysis) {
  const blob = new Blob([JSON.stringify(a, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: `${a.workSlug}.json` }).click();
  URL.revokeObjectURL(url);
}

function exportHtml(a: Analysis) {
  const html = `<!DOCTYPE html><html lang="kk"><head><meta charset="UTF-8"><title>${a.title}</title>
<style>body{font-family:sans-serif;max-width:800px;margin:auto;padding:2rem;line-height:1.7}
h1{color:#1e1b4b}h2{color:#4c1d95;border-bottom:2px solid #e9d5ff;padding-bottom:.5rem}
.meta{color:#666;font-size:.9rem}blockquote{border-left:3px solid #8b5cf6;padding-left:1rem;color:#555}</style>
</head><body>
<h1>${a.title}</h1>
<p class="meta">${a.author} · ${a.period} · ${a.genre}</p>
<h2>Тақырып</h2><p>${a.theme}</p>
<h2>Идея</h2><p>${a.idea}</p>
<h2>Негізгі ой</h2><p>${a.mainThought}</p>
<h2>Қызықты деректер</h2><ul>${a.interestingFacts.map(f => `<li>${f}</li>`).join('')}</ul>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: `${a.workSlug}.html` }).click();
  URL.revokeObjectURL(url);
}

// ── Component ────────────────────────────────────────────────
export default function AnalysisTopBar({ analysis }: { analysis: Analysis }) {
  const [, navigate] = useLocation();
  const [showDownload, setShowDownload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [starred, setStarred] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloads = [
    { label: 'TXT', icon: <FileText size={14} />, action: () => exportTxt(analysis), available: true },
    { label: 'JSON', icon: <FileJson size={14} />, action: () => exportJson(analysis), available: true },
    { label: 'HTML', icon: <FileCode size={14} />, action: () => exportHtml(analysis), available: true },
    { label: 'PDF', icon: <BookOpen size={14} />, action: () => window.print(), available: true },
    { label: 'DOCX', icon: <FileText size={14} />, action: () => {}, available: false },
    { label: 'EPUB', icon: <BookOpen size={14} />, action: () => {}, available: false },
  ];

  return (
    <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/8 print:hidden">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Back */}
        <button
          onClick={() => navigate(-1 as any)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-medium shrink-0"
        >
          <ArrowLeft size={16} /> Артқа
        </button>

        <div className="w-px h-5 bg-white/10 shrink-0" />

        {/* Title */}
        <div className="flex-1 min-w-0 text-center">
          <p className="text-white font-semibold text-sm truncate leading-tight">{analysis.title}</p>
          <p className="text-white/40 text-xs truncate">{analysis.author}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setStarred(s => !s)}
            title="Таңдаулыға қосу"
            className={`p-2 rounded-lg transition-colors ${starred ? 'text-amber-400' : 'text-white/40 hover:text-white'}`}
          >
            <Star size={16} fill={starred ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            title={copied ? 'Көшірілді!' : 'Бөлісу'}
            className="p-2 rounded-lg text-white/40 hover:text-white transition-colors relative"
          >
            <Share2 size={16} />
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap"
                >
                  Көшірілді
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Download dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownload(s => !s)}
              title="Жүктеу"
              className="flex items-center gap-1 p-2 rounded-lg text-white/40 hover:text-white transition-colors"
            >
              <Download size={16} />
              <ChevronDown size={12} className={`transition-transform ${showDownload ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showDownload && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-[#1a1730] border border-white/15 rounded-xl shadow-xl overflow-hidden"
                >
                  {downloads.map(d => (
                    <button
                      key={d.label}
                      onClick={() => { if (d.available) { d.action(); setShowDownload(false); } }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        d.available
                          ? 'text-white hover:bg-white/10'
                          : 'text-white/25 cursor-not-allowed'
                      }`}
                    >
                      {d.icon}
                      {d.label}
                      {!d.available && <span className="ml-auto text-xs text-white/20">жақында</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => window.print()}
            title="Басып шығару"
            className="p-2 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <Printer size={16} />
          </button>

          <button
            onClick={() => setShowSettings(s => !s)}
            title="Қосымша"
            className="p-2 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      {(showDownload || showSettings) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setShowDownload(false); setShowSettings(false); }}
        />
      )}
    </div>
  );
}
