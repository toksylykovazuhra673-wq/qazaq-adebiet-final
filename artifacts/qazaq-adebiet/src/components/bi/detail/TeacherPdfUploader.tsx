import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Eye, Trash2, X, ZoomIn, ZoomOut,
  Printer, Download, GraduationCap, AlertCircle, Pencil, Check,
} from 'lucide-react';
import type { PdfCategory, TeacherPdf } from '@/hooks/useTeacherPdfs';
import { useTeacherPdfs } from '@/hooks/useTeacherPdfs';

// ── PDF viewer modal ──────────────────────────────────────────
function PdfViewerModal({
  pdf,
  onClose,
}: {
  pdf: TeacherPdf;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(100);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/95 border-b border-white/10 shrink-0">
        <p className="text-white text-sm font-medium truncate max-w-sm">{pdf.name}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/50 text-sm w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
          <a
            href={pdf.base64}
            download={`${pdf.name}.pdf`}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Iframe */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <iframe
          src={pdf.base64}
          title={pdf.name}
          style={{ width: `${zoom}%`, minWidth: 600, height: '90vh' }}
          className="rounded-xl border border-white/10 shadow-2xl bg-white"
        />
      </div>
    </motion.div>
  );
}

// ── Single PDF row ────────────────────────────────────────────
function PdfRow({
  pdf,
  onView,
  onDelete,
  onUpdateDesc,
}: {
  pdf: TeacherPdf;
  onView: () => void;
  onDelete: () => void;
  onUpdateDesc: (d: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(pdf.description ?? '');
  const sizeMB = (pdf.sizeBytes / 1048576).toFixed(2);
  const date = new Date(pdf.addedAt).toLocaleDateString('kk-KZ');

  const saveDesc = () => {
    onUpdateDesc(desc);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.03] hover:border-teal-500/20 transition-colors group"
    >
      {/* Icon */}
      <div className="w-12 h-14 rounded-lg bg-gradient-to-b from-red-600/30 to-red-800/20 border border-red-500/20 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-red-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{pdf.name}</p>
        <p className="text-white/35 text-xs">{sizeMB} МБ · {date}</p>

        {/* Description */}
        {editing ? (
          <div className="flex gap-2 mt-2">
            <input
              autoFocus
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveDesc()}
              placeholder="Сипаттама жазыңыз…"
              className="flex-1 px-2.5 py-1 rounded-lg bg-white/8 border border-white/15 text-white/80 text-xs focus:outline-none focus:border-teal-500/40"
            />
            <button
              onClick={saveDesc}
              className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 mt-1 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            <Pencil className="w-3 h-3" />
            {pdf.description ? pdf.description : 'Сипаттама қосу'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Қарау
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/30 hover:text-red-400 border border-white/8 hover:border-red-500/20 transition-colors"
          title="Жою"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Category labels ───────────────────────────────────────────
const CATEGORY_META: Record<
  PdfCategory,
  { label: string; hint: string; color: string }
> = {
  nakyl: {
    label: 'Нақыл сөздері',
    hint: 'Мысалы: билердің нақыл сөздерін, мақал-мәтелдерін қосыңыз',
    color: 'teal',
  },
  dauly: {
    label: 'Даулы сөздері',
    hint: 'Мысалы: билік айтқан даулар, сот шешімдері туралы деректер',
    color: 'amber',
  },
  oratory: {
    label: 'Шешендік сөздері',
    hint: 'Мысалы: толғаулар, арнаулар, өсиет сөздер',
    color: 'violet',
  },
};

// ── Main component ────────────────────────────────────────────
interface Props {
  biSlug: string;
  category: PdfCategory;
}

export default function TeacherPdfUploader({ biSlug, category }: Props) {
  const { pdfs, addPdf, removePdf, updateDescription, uploading, error, maxSizeMB } =
    useTeacherPdfs(biSlug, category);
  const [viewingPdf, setViewingPdf] = useState<TeacherPdf | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = CATEGORY_META[category];

  const accentBorder =
    meta.color === 'teal'
      ? 'border-teal-500/25 bg-teal-500/5'
      : meta.color === 'amber'
      ? 'border-amber-500/25 bg-amber-500/5'
      : 'border-violet-500/25 bg-violet-500/5';

  const accentText =
    meta.color === 'teal'
      ? 'text-teal-400'
      : meta.color === 'amber'
      ? 'text-amber-400'
      : 'text-violet-400';

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await addPdf(file).catch(() => {});
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      removePdf(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <GraduationCap className={`w-4 h-4 ${accentText}`} />
        <h3 className="text-white/80 text-sm font-semibold">
          Мұғалімнің PDF материалдары — {meta.label}
        </h3>
        <span className="text-white/25 text-xs">({pdfs.length} файл)</span>
      </div>

      {/* Drop zone / upload area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border border-dashed ${accentBorder} rounded-2xl p-6 cursor-pointer hover:opacity-90 transition-opacity text-center`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${accentText} border-current`} />
            <p className="text-white/50 text-sm">Жүктелуде…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload className={`w-8 h-8 ${accentText} opacity-70`} />
            <p className="text-white/60 text-sm font-medium">
              PDF файлды осында сүйреңіз немесе басыңыз
            </p>
            <p className="text-white/30 text-xs">{meta.hint}</p>
            <p className="text-white/20 text-xs">Максималды өлшем: {maxSizeMB} МБ</p>
          </div>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF list */}
      <AnimatePresence>
        {pdfs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="relative">
                <PdfRow
                  pdf={pdf}
                  onView={() => setViewingPdf(pdf)}
                  onDelete={() => handleDelete(pdf.id)}
                  onUpdateDesc={(d) => updateDescription(pdf.id, d)}
                />
                {confirmDelete === pdf.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-950/80 backdrop-blur-sm border border-red-500/30 z-10"
                  >
                    <div className="text-center">
                      <p className="text-red-300 text-sm font-medium mb-2">Жою растауы</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDelete(pdf.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-300 text-xs font-medium transition-colors"
                        >
                          Иә, жою
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/60 text-xs font-medium transition-colors"
                        >
                          Болдырмау
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewer modal */}
      <AnimatePresence>
        {viewingPdf && (
          <PdfViewerModal pdf={viewingPdf} onClose={() => setViewingPdf(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
