import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Trash2, ExternalLink, BookOpen,
  Plus, X, Check, AlertCircle, GraduationCap,
} from 'lucide-react';
import type { TeacherUpload } from '@/types/upload';
import { MAX_PDF_BYTES, MAX_PDF_MB, openBase64Pdf } from '@/types/upload';
import { useTeacherUploads, fileToBase64 } from '@/hooks/useUploads';

interface Props { teacherName: string }

const GENRES = ['Поэзия', 'Проза', 'Драма', 'Эпос', 'Аңыз', 'Мақал-мәтел', 'Шешендік сөз', 'Өзге'];
const GRADES = [5, 6, 7, 8, 9, 10, 11];

function fmtSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} МБ` : `${kb} КБ`;
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('kk-KZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Upload form modal ─────────────────────────────────────────────────────────
interface FormState {
  title: string; author: string; description: string;
  gradeLevel: number; genre: string;
  file: File | null; pdfPreview: string | null; error: string;
}

function UploadModal({ onSave, onClose }: {
  onSave: (d: Omit<TeacherUpload, 'id' | 'uploadedAt' | 'teacherName'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    title: '', author: '', description: '',
    gradeLevel: 9, genre: 'Поэзия',
    file: null, pdfPreview: null, error: '',
  });
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState, v: unknown) =>
    setForm(p => ({ ...p, [k]: v, error: '' }));

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      set('error', 'Тек PDF форматы қолдауылады');
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      set('error', `Файл өте үлкен (макс. ${MAX_PDF_MB} МБ). Кішірек PDF таңдаңыз.`);
      return;
    }
    set('file', file);
    if (!form.title) set('title', file.name.replace('.pdf', ''));
  }, [form.title]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSave = async () => {
    if (!form.title.trim()) { set('error', 'Атауын енгізіңіз'); return; }
    if (!form.author.trim()) { set('error', 'Автор атын енгізіңіз'); return; }
    if (!form.file) { set('error', 'PDF файл таңдаңыз'); return; }
    setLoading(true);
    try {
      const pdfData = await fileToBase64(form.file);
      onSave({
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        gradeLevel: form.gradeLevel,
        genre: form.genre,
        pdfData,
        fileName: form.file.name,
        fileSizeKb: Math.round(form.file.size / 1024),
      });
    } catch {
      set('error', 'Файлды оқу кезінде қате орын алды');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-lg shadow-2xl
          max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Upload size={18} className="text-emerald-400" /> Шығарма жүктеу
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer mb-4 transition-all
            ${form.file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'}`}>
          <input ref={fileRef} type="file" accept=".pdf,application/pdf"
            className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {form.file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText size={24} className="text-emerald-400" />
              <div className="text-left">
                <div className="text-white text-sm font-medium">{form.file.name}</div>
                <div className="text-gray-500 text-xs">{fmtSize(Math.round(form.file.size / 1024))}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); set('file', null); }}
                className="ml-2 p-1 rounded-lg text-gray-600 hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div>
              <Upload size={28} className="mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400 text-sm font-medium">PDF файлды осында сүйреңіз</p>
              <p className="text-gray-600 text-xs mt-1">немесе басыңыз · Макс. {MAX_PDF_MB} МБ</p>
            </div>
          )}
        </div>

        {form.error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">{form.error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Шығарма атауы *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Мысалы: Абай Жолы" className="input-field" />
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Автор *</label>
            <input value={form.author} onChange={e => set('author', e.target.value)}
              placeholder="Мысалы: Мұхтар Әуезов" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs block mb-1">Сынып</label>
              <select value={form.gradeLevel} onChange={e => set('gradeLevel', Number(e.target.value))}
                className="input-field">
                {GRADES.map(g => <option key={g} value={g}>{g}-сынып</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">Жанр</label>
              <select value={form.genre} onChange={e => set('genre', e.target.value)}
                className="input-field">
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Қысқаша сипаттама</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Шығарма туралы қысқаша ақпарат…"
              rows={2} className="input-field resize-none" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={14} /> Болдырмау</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 btn-primary">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <motion.div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                Жүктелуде…
              </span>
            ) : (
              <><Check size={14} /> Сақтау</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Upload card ───────────────────────────────────────────────────────────────
function UploadCard({ item, onDelete }: { item: TeacherUpload; onDelete: () => void }) {
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/14 transition-all group">
      <div className="flex gap-3">
        {/* Icon */}
        <div className="w-11 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700
          flex items-center justify-center flex-shrink-0 shadow-lg">
          <FileText size={20} className="text-white/80" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">{item.title}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{item.author}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 rounded-md bg-white/6 text-gray-500 text-[10px]">{item.genre}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
              {item.gradeLevel}-сынып
            </span>
            <span className="text-gray-700 text-[10px]">{fmtSize(item.fileSizeKb)}</span>
          </div>
          {item.description && (
            <p className="text-gray-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
          )}
          <p className="text-gray-700 text-[10px] mt-1.5">{fmtDate(item.uploadedAt)}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => openBase64Pdf(item.pdfData, item.title)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium
            bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all">
          <ExternalLink size={12} /> PDF ашу
        </button>
        {confirmDel ? (
          <div className="flex gap-1">
            <button onClick={onDelete}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all">
              Иә, жою
            </button>
            <button onClick={() => setConfirmDel(false)}
              className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 text-gray-500 text-xs hover:text-white transition-all">
              Жоқ
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmDel(true)}
            className="p-1.5 rounded-lg bg-white/4 border border-white/8 text-gray-600
              hover:text-red-400 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
export default function TchUploads({ teacherName }: Props) {
  const { uploads, addUpload, deleteUpload } = useTeacherUploads(teacherName);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = uploads.filter(u =>
    !search || u.title.toLowerCase().includes(search.toLowerCase()) ||
    u.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">
            Өзіңіздің PDF шығармаларыңызды жүктеп, оқушыларға қол жетімді етіңіз.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="btn-primary flex-shrink-0">
          <Plus size={14} /> Жүктеу
        </button>
      </div>

      {/* Search */}
      {uploads.length > 3 && (
        <div className="relative">
          <BookOpen size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Шығарма немесе автор атауы…"
            className="input-field pl-8 py-2" />
        </div>
      )}

      {/* Stats banner */}
      {uploads.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-emerald-500/8 border border-emerald-500/15
          rounded-2xl text-sm">
          <GraduationCap size={16} className="text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-300 font-medium">{uploads.length} шығарма жүктелген</span>
          <span className="text-gray-600 text-xs ml-auto">Оқушыларға көрінеді</span>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(item => (
              <UploadCard key={item.id} item={item} onDelete={() => deleteUpload(item.id)} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-700">
          <Upload size={44} className="mx-auto mb-4 opacity-25" />
          {uploads.length === 0 ? (
            <>
              <p className="font-medium text-gray-500 mb-1">Жүктелген шығарма жоқ</p>
              <p className="text-sm mb-5">PDF форматындағы кез-келген шығарманы жүктеп салыңыз</p>
              <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
                <Plus size={14} /> Алғашқы шығарманы жүктеу
              </button>
            </>
          ) : (
            <p className="text-sm">«{search}» бойынша нәтиже жоқ</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <UploadModal
            onSave={data => { addUpload(data); setShowModal(false); }}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
