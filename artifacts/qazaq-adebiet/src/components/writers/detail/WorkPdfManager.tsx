import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, X, ZoomIn, ZoomOut, Printer, Download,
  Plus, Trash2, Check, ExternalLink, BookOpen,
  Link, Upload, AlertCircle, Loader2,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useWorkPdf } from '@/hooks/useWriterPdfs';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

// ── WorkPdfViewer — kept as a standalone export for legacy use ──
export function WorkPdfViewer({
  url, title, onClose,
}: { url: string; title: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  const isBase64 = url.startsWith('data:');
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/92 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/95 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <p className="text-white text-sm font-medium truncate max-w-xs">{title}</p>
          {isBase64 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Жүктелген файл
            </span>
          )}
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
          {!isBase64 && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </a>
          )}
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

// ── Unified PDF input form (URL + File Upload tabs) ────────────
type Tab = 'url' | 'file';

function PdfInputForm({
  initialUrl,
  onSave,
  onCancel,
}: { initialUrl?: string; onSave: (url: string, title: string) => void; onCancel: () => void }) {
  const [tab, setTab] = useState<Tab>('url');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [urlErr, setUrlErr] = useState('');
  const [fileErr, setFileErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (v: string) => {
    if (!v.trim()) { setUrlErr('Сілтеме бос болмауы керек'); return false; }
    try { new URL(v); setUrlErr(''); return true; }
    catch { setUrlErr('Жарамды URL енгізіңіз (https://...)'); return false; }
  };

  const submitUrl = () => {
    if (validateUrl(url)) onSave(url.trim(), url.trim().split('/').pop() ?? 'PDF');
  };

  const processFile = useCallback((file: File) => {
    setFileErr('');
    if (file.type !== 'application/pdf') { setFileErr('Тек PDF файл жүктеуге болады'); return; }
    if (file.size > MAX_FILE_BYTES) {
      setFileErr(`Файл 10 МБ-тан аспауы керек (${(file.size / 1048576).toFixed(1)} МБ)`);
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const name = file.name.replace(/\.pdf$/i, '');
      setUploading(false);
      onSave(base64, name);
    };
    reader.onerror = () => { setFileErr('Файлды оқу қатесі'); setUploading(false); };
    reader.readAsDataURL(file);
  }, [onSave]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      className="absolute right-0 top-full mt-1.5 z-50 w-80 rounded-xl border border-white/15 bg-[#130c2a] shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {([['url', Link, 'Сілтеме'], ['file', Upload, 'Файл жүктеу']] as const).map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              tab === id
                ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-white/40 hover:text-white/60'
            }`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {tab === 'url' ? (
          <>
            <input
              autoFocus
              value={url}
              onChange={e => { setUrl(e.target.value); if (urlErr) validateUrl(e.target.value); }}
              onKeyDown={e => { if (e.key === 'Enter') submitUrl(); if (e.key === 'Escape') onCancel(); }}
              placeholder="https://drive.google.com/... немесе .pdf URL"
              className={`w-full px-3 py-2 rounded-lg bg-white/8 border text-white text-sm placeholder-white/30 focus:outline-none transition-colors ${
                urlErr ? 'border-red-500/50' : 'border-white/12 focus:border-amber-500/50'
              }`}
            />
            {urlErr && (
              <p className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3 shrink-0" /> {urlErr}
              </p>
            )}
            <div className="flex gap-2">
              <button onClick={onCancel}
                className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs transition-colors">
                Болдырмау
              </button>
              <button onClick={submitUrl}
                className="flex-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors">
                Сақтау
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                dragging ? 'border-amber-400 bg-amber-500/10' : 'border-white/15 hover:border-amber-400/40 hover:bg-white/3'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                  <p className="text-white/50 text-xs">Жүктелуде...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-7 h-7 text-white/25" />
                  <p className="text-white/60 text-xs font-medium">PDF файлды осында сүйреңіз</p>
                  <p className="text-white/30 text-[11px]">немесе таңдау үшін басыңыз</p>
                  <p className="text-white/20 text-[10px] mt-1">Макс: 10 МБ</p>
                </div>
              )}
            </div>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            {fileErr && (
              <p className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3 shrink-0" /> {fileErr}
              </p>
            )}
            <button onClick={onCancel}
              className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs transition-colors">
              Болдырмау
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Main WorkActions component ─────────────────────────────────
interface WorkActionsProps {
  workId: string;
  workTitle: string;
  writerSlug: string;
  hasRead?: boolean;
  hasPdf?: boolean;
  hasAudio?: boolean;
  compact?: boolean;
}

export function WorkActions({
  workId, workTitle, writerSlug,
  hasRead, hasPdf, hasAudio,
  compact = false,
}: WorkActionsProps) {
  const { entry, setPdf, removePdf } = useWorkPdf(writerSlug, workId);
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const hasPdfNow = !!entry;
  const isFile = hasPdfNow && entry!.url.startsWith('data:');

  const openReader = () => {
    navigate(`/shygarma/${encodeURIComponent(writerSlug)}/${encodeURIComponent(workId)}`);
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

      {/* Оқу — open dedicated reader page */}
      {(hasRead || hasPdfNow) && (
        <button
          onClick={hasPdfNow ? openReader : () => setShowForm(true)}
          className={`${cls} ${
            hasPdfNow
              ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/25'
              : 'bg-primary/20 hover:bg-primary text-white'
          }`}
          title={hasPdfNow ? `${workTitle} — бетін ашу` : 'Оқу'}
        >
          {hasPdfNow
            ? <FileText className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
            : <BookOpen className={compact ? 'w-4 h-4' : 'w-3 h-3'} />}
          {!compact && (hasPdfNow ? (isFile ? '📂 Ашып оқу' : 'Ашып оқу') : 'Оқу')}
        </button>
      )}

      {/* PDF manage — edit link/file */}
      {(hasPdf || hasPdfNow) && (
        <div className="relative">
          <button
            onClick={() => setShowForm(s => !s)}
            className={`${cls} ${
              hasPdfNow
                ? 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20'
                : 'bg-white/10 hover:bg-white/20 text-white/70'
            }`}
            title={hasPdfNow ? 'PDF өзгерту' : 'PDF қосу'}
          >
            <FileText className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
            {!compact && 'PDF'}
          </button>
          <AnimatePresence>
            {showForm && (
              <PdfInputForm
                initialUrl={isFile ? undefined : entry?.url}
                onSave={(url, title) => { setPdf(url, workTitle || title); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* PDF add — when neither flag is set */}
      {!hasPdf && !hasRead && !hasPdfNow && (
        <div className="relative">
          <button
            onClick={() => setShowForm(s => !s)}
            className={`${cls} bg-white/5 hover:bg-amber-500/15 text-white/30 hover:text-amber-400 border border-white/8 hover:border-amber-500/20`}
            title="PDF немесе файл қосу"
          >
            <Plus className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
            {!compact && 'PDF қосу'}
          </button>
          <AnimatePresence>
            {showForm && (
              <PdfInputForm
                onSave={(url, title) => { setPdf(url, workTitle || title); setShowForm(false); }}
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
          title={confirmDel ? 'Растау' : 'PDF жою'}
        >
          {confirmDel ? <Check className={compact ? 'w-4 h-4' : 'w-3 h-3'} /> : <Trash2 className={compact ? 'w-4 h-4' : 'w-3 h-3'} />}
          {!compact && (confirmDel ? 'Растау' : '')}
        </button>
      )}

      {/* External link — URL-based only */}
      {hasPdfNow && !isFile && (
        <a href={entry!.url} target="_blank" rel="noopener noreferrer"
          className={`${cls} bg-white/5 hover:bg-white/10 text-white/25 hover:text-white ${compact ? 'border border-white/8' : ''}`}
          title="Жаңа қойындыда ашу">
          <ExternalLink className={compact ? 'w-4 h-4' : 'w-3 h-3'} />
        </a>
      )}
    </div>
  );
}
