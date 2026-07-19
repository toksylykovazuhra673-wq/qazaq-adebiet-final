import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Plus, FileText, Eye, Trash2, X,
  ZoomIn, ZoomOut, Printer, Download, AlertCircle, Check, ExternalLink,
} from 'lucide-react';
import type { WriterSection, WriterSectionPdf } from '@/hooks/useWriterPdfs';
import { useWriterSectionPdfs } from '@/hooks/useWriterPdfs';

// ── PDF viewer modal ──────────────────────────────────────────
function PdfModal({ pdf, onClose }: { pdf: WriterSectionPdf; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/92 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/95 border-b border-white/10 shrink-0">
        <p className="text-white text-sm font-medium truncate max-w-xs">{pdf.title}</p>
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
          <a href={pdf.url} target="_blank" rel="noopener noreferrer"
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
        <iframe src={pdf.url} title={pdf.title}
          style={{ width: `${zoom}%`, minWidth: 600, height: '90vh' }}
          className="rounded-xl border border-white/10 shadow-2xl bg-white" />
      </div>
    </motion.div>
  );
}

// ── Add form ──────────────────────────────────────────────────
function AddPdfForm({ onAdd, onCancel }: { onAdd: (t: string, u: string, d?: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [err, setErr] = useState('');

  const validate = (v: string) => {
    try { new URL(v); setErr(''); return true; }
    catch { setErr('Жарамды сілтеме енгізіңіз (https://...)'); return false; }
  };

  const submit = () => {
    if (!title.trim()) return;
    if (!validate(url)) return;
    onAdd(title.trim(), url.trim(), desc.trim() || undefined);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="PDF атауы"
          className="px-3 py-2.5 rounded-lg bg-white/8 border border-white/12 text-white text-sm placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors" />
        <div>
          <input value={url} onChange={e => { setUrl(e.target.value); if (err) validate(e.target.value); }}
            placeholder="https://... (Google Drive, тікелей PDF)"
            className={`w-full px-3 py-2.5 rounded-lg bg-white/8 border text-white text-sm placeholder-white/30 focus:outline-none transition-colors ${
              err ? 'border-red-500/50' : 'border-white/12 focus:border-violet-500/50'
            }`} />
          {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
        </div>
      </div>
      <input value={desc} onChange={e => setDesc(e.target.value)}
        placeholder="Қысқаша сипаттама (міндетті емес)"
        className="w-full px-3 py-2.5 rounded-lg bg-white/8 border border-white/12 text-white text-sm placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors" />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-sm transition-colors">
          Болдырмау
        </button>
        <button onClick={submit} disabled={!title.trim() || !url.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Қосу
        </button>
      </div>
    </motion.div>
  );
}

// ── PDF row ───────────────────────────────────────────────────
function PdfRow({ pdf, onView, onDelete }: { pdf: WriterSectionPdf; onView: () => void; onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const date = new Date(pdf.addedAt).toLocaleDateString('kk-KZ');

  const handleDel = () => {
    if (confirm) { onDelete(); } else { setConfirm(true); setTimeout(() => setConfirm(false), 3000); }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className="flex gap-4 p-3 rounded-xl border border-white/8 bg-white/[0.03] hover:border-violet-500/20 transition-colors group">
      <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-violet-600/30 to-violet-800/20 border border-violet-500/20 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{pdf.title}</p>
        <p className="text-white/35 text-xs">{date}{pdf.description && ` · ${pdf.description}`}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={onView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 border border-violet-500/20 transition-colors">
          <Eye className="w-3.5 h-3.5" /> Қарау
        </button>
        <a href={pdf.url} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white border border-white/8 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={handleDel}
          className={`p-1.5 rounded-lg border transition-colors ${
            confirm
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 border-white/8 hover:border-red-500/20'
          }`}>
          {confirm ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}

// ── Config ────────────────────────────────────────────────────
const SECTION_META: Record<WriterSection, { label: string; hint: string }> = {
  family: {
    label: 'Отбасы — PDF материалдар',
    hint: 'Жазушының отбасы туралы мақалалар, зерттеулер немесе кітаптар PDF-ін қосыңыз',
  },
  education: {
    label: 'Білімі — PDF материалдар',
    hint: 'Жазушының білімі, оқыған жерлері туралы деректер мен зерттеулерді қосыңыз',
  },
};

// ── Main export ───────────────────────────────────────────────
interface Props { writerSlug: string; section: WriterSection; }

export default function WriterPdfLinkSection({ writerSlug, section }: Props) {
  const { pdfs, addPdf, removePdf } = useWriterSectionPdfs(writerSlug, section);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<WriterSectionPdf | null>(null);
  const meta = SECTION_META[section];

  const handleAdd = (t: string, u: string, d?: string) => {
    addPdf(t, u, d);
    setShowForm(false);
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-violet-400" />
          <h3 className="text-white/80 text-sm font-semibold">{meta.label}</h3>
          <span className="text-white/25 text-xs">({pdfs.length})</span>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors">
          <Plus className="w-3.5 h-3.5" /> PDF қосу
        </button>
      </div>

      {/* Hint */}
      {pdfs.length === 0 && !showForm && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-violet-500/15 bg-white/[0.02] text-white/35 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-violet-400/50" />
          {meta.hint}
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && <AddPdfForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}
      </AnimatePresence>

      {/* List */}
      <AnimatePresence>
        {pdfs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {pdfs.map(pdf => (
              <PdfRow key={pdf.id} pdf={pdf}
                onView={() => setViewing(pdf)}
                onDelete={() => removePdf(pdf.id)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewer */}
      <AnimatePresence>
        {viewing && <PdfModal pdf={viewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </div>
  );
}
