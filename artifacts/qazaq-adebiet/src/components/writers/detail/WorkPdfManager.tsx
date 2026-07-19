import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, X, ZoomIn, ZoomOut, Printer, Download,
  Plus, Trash2, Check, ExternalLink, BookOpen,
} from 'lucide-react';
import { useWorkPdf } from '@/hooks/useWriterPdfs';

// ── Full-screen PDF viewer ────────────────────────────────────
export function WorkPdfViewer({
  url, title, onClose,
}: { url: string; title: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/92 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/95 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <p className="text-white text-sm font-medium truncate max-w-xs">{title}</p>
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
        <iframe src={url} title={title}
          style={{ width: `${zoom}%`, minWidth: 600, height: '90vh' }}
          className="rounded-xl border border-white/10 shadow-2xl bg-white" />
      </div>
    </motion.div>
  );
}

// ── Inline URL form (popover-style) ──────────────────────────
function PdfUrlForm({
  initialUrl,
  onSave,
  onCancel,
}: { initialUrl?: string; onSave: (url: string) => void; onCancel: () => void }) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [err, setErr] = useState('');

  const validate = (v: string) => {
    if (!v.trim()) { setErr('Сілтеме бос болмауы керек'); return false; }
    try { new URL(v); setErr(''); return true; }
    catch { setErr('Жарамды URL енгізіңіз (https://...)'); return false; }
  };

  const submit = () => { if (validate(url)) onSave(url.trim()); };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-full mt-1.5 z-50 w-80 rounded-xl border border-white/15 bg-[#130c2a] shadow-2xl p-4 space-y-3">
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">PDF сілтемесін қосу</p>
      <input value={url} onChange={e => { setUrl(e.target.value); if (err) validate(e.target.value); }}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="https://drive.google.com/... немесе .pdf URL"
        className={`w-full px-3 py-2 rounded-lg bg-white/8 border text-white text-sm placeholder-white/30 focus:outline-none transition-colors ${
          err ? 'border-red-500/50 focus:border-red-500/70' : 'border-white/12 focus:border-amber-500/50'
        }`} />
      {err && <p className="text-red-400 text-xs">{err}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs transition-colors">
          Болдырмау
        </button>
        <button onClick={submit}
          className="flex-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors">
          Сақтау
        </button>
      </div>
    </motion.div>
  );
}

// ── Main hook-powered action buttons ─────────────────────────
// Renders the action cell/row for one work — replaces hasRead/hasPdf/hasAudio buttons
interface WorkActionsProps {
  workId: string;
  workTitle: string;
  writerSlug: string;
  hasRead?: boolean;
  hasPdf?: boolean;
  hasAudio?: boolean;
  compact?: boolean; // true = icon-only (table row), false = text labels (mobile card)
}

export function WorkActions({
  workId, workTitle, writerSlug,
  hasRead, hasPdf, hasAudio,
  compact = false,
}: WorkActionsProps) {
  const { entry, setPdf, removePdf } = useWorkPdf(writerSlug, workId);
  const [showViewer, setShowViewer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const hasPdfNow = !!entry;

  const handleReadClick = () => {
    if (hasPdfNow) { setShowViewer(true); return; }
    if (hasRead) { setShowForm(true); } // fallback — open form if no PDF yet
  };

  const handlePdfBtnClick = () => {
    if (hasPdfNow) { setShowViewer(true); }
    else { setShowForm(s => !s); }
  };

  const handleDelPdf = () => {
    if (confirmDel) { removePdf(); setConfirmDel(false); }
    else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); }
  };

  const cls = compact
    ? 'w-8 h-8 rounded-lg flex items-center justify-center transition-colors'
    : 'flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors';

  return (
    <div className={`relative ${compact ? 'flex justify-end gap-2' : 'flex gap-2 mt-2 pt-2 border-t border-white/5'}`}>

      {/* Оқу / Open PDF button */}
      {(hasRead || hasPdfNow) && (
        <button
          onClick={handleReadClick}
          className={`${cls} ${
            hasPdfNow
              ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/25'
              : 'bg-primary/20 hover:bg-primary text-white'
          }`}
          title={hasPdfNow ? `${workTitle} — PDF қарау` : 'Оқу'}
        >
          {hasPdfNow ? <FileText className={compact ? 'w-4 h-4' : 'w-3 h-3'} /> : <BookOpen className={compact ? 'w-4 h-4' : 'w-3 h-3'} />}
          {!compact && (hasPdfNow ? 'PDF оқу' : 'Оқу')}
        </button>
      )}

      {/* PDF manage button — shown when hasPdf flag OR already has URL */}
      {(hasPdf || hasPdfNow) && (
        <div className="relative">
          <button
            onClick={handlePdfBtnClick}
            className={`${cls} ${
              hasPdfNow
                ? 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20'
                : 'bg-white/10 hover:bg-white/20 text-white/70'
            }`}
            title={hasPdfNow ? 'PDF ашу немесе өзгерту' : 'PDF сілтемесін қосу'}
          >
            <FileText className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
            {!compact && 'PDF'}
          </button>

          <AnimatePresence>
            {showForm && (
              <PdfUrlForm
                initialUrl={entry?.url}
                onSave={(url) => { setPdf(url, workTitle); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* PDF add button — when neither flag is set */}
      {!hasPdf && !hasRead && !hasPdfNow && (
        <div className="relative">
          <button
            onClick={() => setShowForm(s => !s)}
            className={`${cls} bg-white/5 hover:bg-amber-500/15 text-white/30 hover:text-amber-400 border border-white/8 hover:border-amber-500/20`}
            title="PDF сілтемесін қосу"
          >
            <Plus className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
            {!compact && 'PDF қосу'}
          </button>
          <AnimatePresence>
            {showForm && (
              <PdfUrlForm
                onSave={(url) => { setPdf(url, workTitle); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Remove PDF */}
      {hasPdfNow && (
        <button
          onClick={handleDelPdf}
          className={`${cls} ${compact ? 'border border-white/8' : ''} ${
            confirmDel
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-white/5 hover:bg-red-500/10 text-white/25 hover:text-red-400'
          }`}
          title={confirmDel ? 'Растау — тағы бір рет басыңыз' : 'PDF жою'}
        >
          {confirmDel ? <Check className={compact ? 'w-4 h-4' : 'w-3 h-3'} /> : <Trash2 className={compact ? 'w-4 h-4' : 'w-3 h-3'} />}
          {!compact && (confirmDel ? 'Растау' : '')}
        </button>
      )}

      {/* Open externally */}
      {hasPdfNow && (
        <a href={entry!.url} target="_blank" rel="noopener noreferrer"
          className={`${cls} bg-white/5 hover:bg-white/10 text-white/25 hover:text-white ${compact ? 'border border-white/8' : ''}`}
          title="Жаңа қойындыда ашу">
          <ExternalLink className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
        </a>
      )}

      {/* Viewer modal */}
      <AnimatePresence>
        {showViewer && entry && (
          <WorkPdfViewer url={entry.url} title={entry.title} onClose={() => setShowViewer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
