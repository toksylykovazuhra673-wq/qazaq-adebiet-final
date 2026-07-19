/**
 * ItemPdfButton — reusable per-item PDF button (URL link OR file upload).
 * On click, navigates to the dedicated /shygarma/:ownerSlug/:itemId reader page.
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Trash2, Check,
  Link, Upload, AlertCircle, Loader2,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useWorkPdf } from '@/hooks/useWriterPdfs';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

// ── Tabbed PDF input popover ───────────────────────────────────
type Tab = 'url' | 'file';

function PdfInputPopover({
  initialUrl,
  onSave,
  onCancel,
}: { initialUrl?: string; onSave: (url: string, name: string) => void; onCancel: () => void }) {
  const [tab, setTab] = useState<Tab>('url');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [urlErr, setUrlErr] = useState('');
  const [fileErr, setFileErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (v: string) => {
    if (!v.trim()) { setUrlErr('URL бос болмауы керек'); return false; }
    try { new URL(v); setUrlErr(''); return true; }
    catch { setUrlErr('https:// кіргізіңіз'); return false; }
  };

  const processFile = useCallback((file: File) => {
    setFileErr('');
    if (file.type !== 'application/pdf') { setFileErr('Тек PDF файл жүктеуге болады'); return; }
    if (file.size > MAX_FILE_BYTES) { setFileErr(`Файл 10 МБ-тан аспауы керек (${(file.size / 1048576).toFixed(1)} МБ)`); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onSave(reader.result as string, file.name.replace(/\.pdf$/i, ''));
      setUploading(false);
    };
    reader.onerror = () => { setFileErr('Файлды оқу қатесі'); setUploading(false); };
    reader.readAsDataURL(file);
  }, [onSave]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-xl border border-white/15 bg-[#130c2a] shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {([['url', Link, 'Сілтеме'], ['file', Upload, 'Файл']] as const).map(([id, Icon, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              tab === id
                ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-white/40 hover:text-white/60'
            }`}>
            <Icon className="w-3 h-3" /> {label}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-2">
        {tab === 'url' ? (
          <>
            <input
              autoFocus
              value={url}
              onChange={e => { setUrl(e.target.value); if (urlErr) validateUrl(e.target.value); }}
              onKeyDown={e => {
                if (e.key === 'Enter' && validateUrl(url)) onSave(url.trim(), url.trim().split('/').pop() ?? 'PDF');
                if (e.key === 'Escape') onCancel();
              }}
              placeholder="https://drive.google.com/..."
              className={`w-full px-3 py-2 rounded-lg bg-white/8 border text-white text-xs placeholder-white/25 focus:outline-none transition-colors ${
                urlErr ? 'border-red-500/50' : 'border-white/12 focus:border-amber-500/50'
              }`}
            />
            {urlErr && <p className="flex items-center gap-1 text-red-400 text-[11px]"><AlertCircle className="w-3 h-3" />{urlErr}</p>}
            <div className="flex gap-1.5">
              <button onClick={onCancel} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/45 text-xs transition-colors">Болдырмау</button>
              <button
                onClick={() => { if (validateUrl(url)) onSave(url.trim(), url.trim().split('/').pop() ?? 'PDF'); }}
                className="flex-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
              >
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
              className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
                dragging ? 'border-amber-400 bg-amber-500/10' : 'border-white/15 hover:border-amber-400/40 hover:bg-white/3'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-1.5">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  <p className="text-white/50 text-xs">Жүктелуде...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Upload className="w-6 h-6 text-white/25" />
                  <p className="text-white/60 text-xs font-medium">PDF файлды осында сүйреңіз</p>
                  <p className="text-white/30 text-[11px]">немесе таңдау үшін басыңыз</p>
                  <p className="text-white/20 text-[10px]">Макс: 10 МБ</p>
                </div>
              )}
            </div>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            {fileErr && <p className="flex items-center gap-1 text-red-400 text-[11px]"><AlertCircle className="w-3 h-3" />{fileErr}</p>}
            <button onClick={onCancel} className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/45 text-xs transition-colors">Болдырмау</button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────
interface Props {
  ownerSlug: string;
  itemId: string;
  itemTitle: string;
  variant?: 'inline' | 'icon';
}

export default function ItemPdfButton({ ownerSlug, itemId, itemTitle, variant = 'inline' }: Props) {
  const { entry, setPdf, removePdf } = useWorkPdf(ownerSlug, itemId);
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const hasPdf = !!entry;
  const isFile = hasPdf && entry!.url.startsWith('data:');

  const openReader = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/shygarma/${encodeURIComponent(ownerSlug)}/${encodeURIComponent(itemId)}`);
  };

  const handleDel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDel) { removePdf(); setConfirmDel(false); }
    else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); }
  };

  if (variant === 'icon') {
    return (
      <div className="relative inline-flex items-center gap-1">
        <button
          title={hasPdf ? 'PDF бетін ашу' : 'PDF қосу (сілтеме немесе файл)'}
          onClick={e => { e.stopPropagation(); hasPdf ? openReader(e) : setShowForm(s => !s); }}
          className={`p-2 rounded-xl border transition-colors ${
            hasPdf
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/25'
              : 'bg-white/5 hover:bg-amber-500/10 text-white/35 hover:text-amber-400 border-white/10 hover:border-amber-500/20'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
        {hasPdf && (
          <button title={confirmDel ? 'Растау' : 'PDF жою'} onClick={handleDel}
            className={`p-2 rounded-xl border transition-colors ${
              confirmDel ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 hover:bg-red-500/10 text-white/25 hover:text-red-400 border-white/8'
            }`}>
            {confirmDel ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        )}
        <AnimatePresence>
          {showForm && (
            <PdfInputPopover
              initialUrl={isFile ? undefined : entry?.url}
              onSave={(url, name) => { setPdf(url, itemTitle || name); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
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
            onClick={openReader}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            {isFile ? '📂 Ашып оқу' : 'Ашып оқу'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); setShowForm(s => !s); }}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/35 border border-white/8 transition-colors"
            title="Өзгерту"
          >
            ✎
          </button>
          <button
            onClick={handleDel}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
              confirmDel ? 'bg-red-500/15 text-red-400 border-red-500/25' : 'bg-white/5 hover:bg-red-500/10 text-white/25 hover:text-red-400 border-white/8'
            }`}
            title={confirmDel ? 'Растау' : 'PDF жою'}
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
          <PdfInputPopover
            initialUrl={isFile ? undefined : entry?.url}
            onSave={(url, name) => { setPdf(url, itemTitle || name); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
