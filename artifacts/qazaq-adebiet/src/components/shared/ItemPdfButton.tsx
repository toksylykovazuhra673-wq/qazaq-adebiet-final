/**
 * ItemPdfButton — reusable per-item PDF link add/view button.
 * Uses useWorkPdf hook (localStorage) to store one PDF URL per item.
 * Renders a compact "PDF қосу" button that, once a URL is saved,
 * turns into an amber "PDF оқу" button that opens a full-screen viewer.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, X, ZoomIn, ZoomOut,
  Printer, Download, Trash2, Check,
} from 'lucide-react';
import { useWorkPdf } from '@/hooks/useWriterPdfs';

// ── Full-screen viewer (shared) ───────────────────────────────
function PdfViewer({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/92 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/95 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <p className="text-white text-sm font-medium truncate max-w-sm">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/50 text-sm w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => window.print()}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </a>
          <button onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <iframe
          src={url} title={title}
          style={{ width: `${zoom}%`, minWidth: 600, height: '90vh' }}
          className="rounded-xl border border-white/10 shadow-2xl bg-white"
        />
      </div>
    </motion.div>
  );
}

// ── URL input popover ─────────────────────────────────────────
function UrlPopover({
  initialUrl,
  onSave,
  onCancel,
}: { initialUrl?: string; onSave: (url: string) => void; onCancel: () => void }) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [err, setErr] = useState('');

  const validate = (v: string) => {
    if (!v.trim()) { setErr('URL бос болмауы керек'); return false; }
    try { new URL(v); setErr(''); return true; }
    catch { setErr('https:// кіргізіңіз'); return false; }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-xl border border-white/15 bg-[#130c2a] shadow-2xl p-3 space-y-2"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-white/60 text-xs font-semibold">PDF сілтемесін қосу</p>
      <input
        autoFocus
        value={url}
        onChange={e => { setUrl(e.target.value); if (err) validate(e.target.value); }}
        onKeyDown={e => { if (e.key === 'Enter') { if (validate(url)) onSave(url.trim()); } if (e.key === 'Escape') onCancel(); }}
        placeholder="https://drive.google.com/... немесе .pdf URL"
        className={`w-full px-3 py-2 rounded-lg bg-white/8 border text-white text-xs placeholder-white/25 focus:outline-none transition-colors ${
          err ? 'border-red-500/50' : 'border-white/12 focus:border-amber-500/50'
        }`}
      />
      {err && <p className="text-red-400 text-[11px]">{err}</p>}
      <div className="flex gap-1.5">
        <button onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/45 text-xs transition-colors">
          Бас тарту
        </button>
        <button
          onClick={() => { if (validate(url)) onSave(url.trim()); }}
          className="flex-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors">
          Сақтау
        </button>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
interface Props {
  /** Slug of the owner (writer, poet, author) */
  ownerSlug: string;
  /** Unique id for this item — prefix with type: 'novel-3', 'poem-7', etc. */
  itemId: string;
  /** Shown in the viewer title bar */
  itemTitle: string;
  /** 'inline' = horizontal row of buttons (card footer); 'icon' = single compact icon button */
  variant?: 'inline' | 'icon';
}

export default function ItemPdfButton({
  ownerSlug, itemId, itemTitle, variant = 'inline',
}: Props) {
  const { entry, setPdf, removePdf } = useWorkPdf(ownerSlug, itemId);
  const [showForm, setShowForm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const hasPdf = !!entry;

  const handleDel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDel) { removePdf(); setConfirmDel(false); }
    else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); }
  };

  if (variant === 'icon') {
    return (
      <div className="relative inline-flex items-center gap-1">
        <button
          title={hasPdf ? 'PDF оқу' : 'PDF қосу'}
          onClick={e => { e.stopPropagation(); hasPdf ? setShowViewer(true) : setShowForm(s => !s); }}
          className={`p-2 rounded-xl border transition-colors ${
            hasPdf
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/25'
              : 'bg-white/5 hover:bg-amber-500/10 text-white/35 hover:text-amber-400 border-white/10 hover:border-amber-500/20'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
        {hasPdf && (
          <button
            title={confirmDel ? 'Растау' : 'PDF жою'}
            onClick={handleDel}
            className={`p-2 rounded-xl border transition-colors ${
              confirmDel
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-white/5 hover:bg-red-500/10 text-white/25 hover:text-red-400 border-white/8 hover:border-red-500/20'
            }`}
          >
            {confirmDel ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        )}
        <AnimatePresence>
          {showForm && (
            <UrlPopover
              initialUrl={entry?.url}
              onSave={url => { setPdf(url, itemTitle); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showViewer && entry && (
            <PdfViewer url={entry.url} title={entry.title} onClose={() => setShowViewer(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // inline variant
  return (
    <div className="relative flex items-center gap-1.5 mt-3 pt-3 border-t border-white/6">
      {hasPdf ? (
        <>
          <button
            onClick={() => setShowViewer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> PDF оқу
          </button>
          <button
            onClick={e => { e.stopPropagation(); setShowForm(s => !s); }}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/35 border border-white/8 transition-colors"
            title="Сілтемені өзгерту"
          >
            ✎
          </button>
          <button
            onClick={handleDel}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
              confirmDel
                ? 'bg-red-500/15 text-red-400 border-red-500/25'
                : 'bg-white/5 hover:bg-red-500/10 text-white/25 hover:text-red-400 border-white/8 hover:border-red-500/20'
            }`}
            title={confirmDel ? 'Растау — тағы бір рет' : 'PDF жою'}
          >
            {confirmDel ? <Check className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-amber-500/10 text-white/35 hover:text-amber-400 border border-white/8 hover:border-amber-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> PDF қосу
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <UrlPopover
            initialUrl={entry?.url}
            onSave={url => { setPdf(url, itemTitle); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showViewer && entry && (
          <PdfViewer url={entry.url} title={entry.title} onClose={() => setShowViewer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
