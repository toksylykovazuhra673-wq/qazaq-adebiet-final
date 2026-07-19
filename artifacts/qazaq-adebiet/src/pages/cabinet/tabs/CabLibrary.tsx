import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  BookOpen, Headphones, FileText, Heart, ChevronRight,
  Search, Filter, Upload, Plus, X, Check, Trash2,
  ExternalLink, GraduationCap, AlertCircle,
} from 'lucide-react';
import type { ReadingRecord } from '@/types/student';
import type { TeacherUpload, StudentUpload } from '@/types/upload';
import { MAX_PDF_BYTES, MAX_PDF_MB, openBase64Pdf, TEACHER_UPLOADS_KEY } from '@/types/upload';
import { useStudentUploads, fileToBase64 } from '@/hooks/useUploads';
import rawBooks from '@/data/books.json';

interface BookEntry {
  id: string; slug: string; title: string; authorName: string; genre: string;
  year: number | string; description: string; cover: string;
  pdfAvailable: boolean; audioAvailable: boolean; gradeLevel?: number;
}
const BOOKS = rawBooks as unknown as BookEntry[];

const COVERS = [
  'from-violet-600 to-purple-700','from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700','from-orange-500 to-red-600',
  'from-rose-500 to-pink-600','from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600','from-purple-500 to-indigo-600',
];

type LibFilter = 'all' | 'reading' | 'finished' | 'favorites' | 'pdf' | 'audio';

interface Props { readingRecords: ReadingRecord[] }

// ── Progress ring ─────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 40 }: { pct: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#pg)" strokeWidth={3}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" className="transition-all duration-700" />
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function fmtSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} МБ` : `${kb} КБ`;
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('kk-KZ', { day: 'numeric', month: 'short' });
}

// ── Student PDF upload modal ──────────────────────────────────────────────────
function StudentUploadModal({ onSave, onClose }: {
  onSave: (d: Omit<StudentUpload,'id'|'uploadedAt'>) => void;
  onClose: () => void;
}) {
  const [title, setTitle]   = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile]     = useState<File | null>(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.includes('pdf')) { setError('Тек PDF форматы'); return; }
    if (f.size > MAX_PDF_BYTES) { setError(`Макс. ${MAX_PDF_MB} МБ файл таңдаңыз`); return; }
    setFile(f);
    if (!title) setTitle(f.name.replace('.pdf', ''));
    setError('');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [title]);

  const handleSave = async () => {
    if (!title.trim()) { setError('Атауын енгізіңіз'); return; }
    if (!file) { setError('PDF файл таңдаңыз'); return; }
    setLoading(true);
    try {
      const pdfData = await fileToBase64(file);
      onSave({ title: title.trim(), author: author.trim() || 'Белгісіз', pdfData, fileName: file.name, fileSizeKb: Math.round(file.size / 1024) });
    } catch { setError('Файлды оқу кезінде қате'); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            <Upload size={16} className="text-violet-400" /> PDF қосу
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer mb-4 transition-all
            ${file ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/12 hover:border-white/25 hover:bg-white/4'}`}>
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <FileText size={20} className="text-violet-400" />
              <div className="text-left">
                <div className="text-white text-sm">{file.name}</div>
                <div className="text-gray-500 text-xs">{fmtSize(Math.round(file.size / 1024))}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); setFile(null); }}
                className="ml-2 p-1 text-gray-600 hover:text-red-400 transition-colors">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div>
              <Upload size={24} className="mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400 text-sm">PDF сүйреңіз немесе таңдаңыз</p>
              <p className="text-gray-600 text-xs mt-0.5">Макс. {MAX_PDF_MB} МБ</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-3">
            <AlertCircle size={13} className="text-red-400" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1">Шығарма атауы *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Атауын енгізіңіз" className="input-field" />
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-1">Автор</label>
            <input value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="Автор аты" className="input-field" />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 btn-ghost"><X size={13} /> Болдырмау</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 btn-primary">
            {loading
              ? <motion.div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full mx-auto"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              : <><Check size={13} /> Сақтау</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main CabLibrary ───────────────────────────────────────────────────────────
export default function CabLibrary({ readingRecords }: Props) {
  const [, navigate] = useLocation();
  const [filter, setFilter]   = useState<LibFilter>('all');
  const [search, setSearch]   = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [activeSection, setActiveSection] = useState<'system' | 'teacher' | 'mine'>('system');

  // Student personal uploads
  const { uploads: myUploads, addUpload, deleteUpload } = useStudentUploads();
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  // Teacher uploads (read-only from localStorage)
  const [teacherUploads] = useState<TeacherUpload[]>(() => {
    try { return JSON.parse(localStorage.getItem(TEACHER_UPLOADS_KEY) ?? '[]') as TeacherUpload[]; }
    catch { return []; }
  });

  const recMap = Object.fromEntries(readingRecords.map(r => [r.bookSlug, r]));

  const filtered = BOOKS.filter(book => {
    const rec = recMap[book.id];
    const q = search.toLowerCase();
    const matchSearch = !q ||
      book.title.toLowerCase().includes(q) ||
      (book.authorName ?? '').toLowerCase().includes(q) ||
      (book.genre ?? '').toLowerCase().includes(q);
    if (!matchSearch) return false;
    switch (filter) {
      case 'reading':   return rec && rec.textProgress > 0 && rec.textProgress < 90;
      case 'finished':  return rec && rec.textProgress >= 90;
      case 'favorites': return rec?.isFavorite;
      case 'pdf':       return book.pdfAvailable;
      case 'audio':     return book.audioAvailable;
      default:          return true;
    }
  });

  const FILTERS: { id: LibFilter; label: string }[] = [
    { id: 'all',       label: 'Барлығы' },
    { id: 'reading',   label: 'Оқылуда' },
    { id: 'finished',  label: 'Аяқталды' },
    { id: 'favorites', label: '❤️ Таңдаулы' },
    { id: 'pdf',       label: 'PDF' },
    { id: 'audio',     label: 'Аудио' },
  ];

  const SECTIONS = [
    { id: 'system'  as const, label: 'Кітапхана',            count: BOOKS.length       },
    { id: 'teacher' as const, label: 'Мұғалімнің шығармалары', count: teacherUploads.length },
    { id: 'mine'    as const, label: 'Менің PDF-терім',       count: myUploads.length   },
  ];

  return (
    <div className="space-y-5">
      {/* ── Section tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeSection === s.id
                ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                : 'bg-white/4 border border-white/8 text-gray-500 hover:text-gray-300'}`}>
            {s.label}
            {s.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeSection === s.id ? 'bg-violet-500/30 text-violet-300' : 'bg-white/8 text-gray-600'
              }`}>{s.count}</span>
            )}
          </button>
        ))}

        {/* Add PDF button (only for "mine" tab) */}
        {activeSection === 'mine' && (
          <button onClick={() => setShowUpload(true)}
            className="flex-shrink-0 ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
              bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 transition-all">
            <Plus size={13} /> PDF қосу
          </button>
        )}
      </div>

      {/* ── SECTION: System library ────────────────────────────────────── */}
      {activeSection === 'system' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Кітап атауы, автор…"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5
                  text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <Filter size={13} className="text-gray-600 flex-shrink-0" />
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f.id
                      ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                      : 'bg-white/4 border border-white/8 text-gray-500 hover:text-gray-300'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>{BOOKS.length} кітап жалпы</span>
            <span>·</span>
            <span className="text-violet-400">{readingRecords.filter(r => r.textProgress >= 90).length} оқылды</span>
            <span>·</span>
            <span className="text-indigo-400">{readingRecords.filter(r => r.isFavorite).length} таңдаулы</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((book, idx) => {
              const rec = recMap[book.id];
              const pct = rec?.textProgress ?? 0;
              const finished = pct >= 90;
              const inProgress = pct > 0 && !finished;
              const coverGrad = COVERS[idx % COVERS.length];
              return (
                <motion.div key={book.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * idx }}
                  className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden
                    hover:border-white/15 hover:bg-white/6 transition-all group">
                  <div className={`h-2 bg-gradient-to-r ${coverGrad}`} />
                  <div className="p-4">
                    <div className="flex gap-3 items-start">
                      <div className={`flex-shrink-0 w-12 h-16 rounded-lg bg-gradient-to-br ${coverGrad}
                        flex items-center justify-center relative overflow-hidden shadow-lg`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <span className="relative text-white/60 font-bold text-lg">
                          {book.title.slice(0,1).toUpperCase()}
                        </span>
                        {rec?.isFavorite && (
                          <div className="absolute top-0.5 right-0.5">
                            <Heart size={10} className="text-rose-400 fill-current" />
                          </div>
                        )}
                        {finished && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-lg">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-semibold leading-tight mb-0.5 truncate">{book.title}</h3>
                        <p className="text-gray-500 text-xs truncate">{book.authorName}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="px-1.5 py-0.5 rounded-md bg-white/6 text-gray-500 text-[10px]">{book.genre}</span>
                          {book.pdfAvailable && <FileText size={10} className="text-blue-400/70" />}
                          {book.audioAvailable && <Headphones size={10} className="text-indigo-400/70" />}
                        </div>
                      </div>
                      {pct > 0 && (
                        <div className="relative flex-shrink-0">
                          <ProgressRing pct={pct} size={38} />
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold">
                            {Math.round(pct)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {finished && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">✓ Оқылды</span>}
                      {inProgress && <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-medium">Оқылуда {Math.round(pct)}%</span>}
                    </div>
                    {pct > 0 && (
                      <div className="mt-2 h-1 bg-white/6 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${finished ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => navigate(`/reader/${book.id}`)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          pct > 0
                            ? 'bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25'
                            : 'bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}>
                        <BookOpen size={12} />
                        {pct > 0 ? 'Жалғастыру' : 'Ашу'}
                        <ChevronRight size={11} className="ml-auto" />
                      </button>
                      {book.pdfAvailable && (
                        <button onClick={() => navigate(`/reader/${book.id}`)}
                          className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
                          <FileText size={13} />
                        </button>
                      )}
                      {book.audioAvailable && (
                        <button onClick={() => navigate(`/reader/${book.id}`)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all">
                          <Headphones size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Кітаптар табылмады</p>
            </div>
          )}
        </>
      )}

      {/* ── SECTION: Teacher uploads ───────────────────────────────────── */}
      {activeSection === 'teacher' && (
        <div>
          {teacherUploads.length === 0 ? (
            <div className="text-center py-20 text-gray-700">
              <GraduationCap size={44} className="mx-auto mb-4 opacity-25" />
              <p className="text-gray-500 font-medium mb-1">Мұғалімнің шығармалары жоқ</p>
              <p className="text-sm">Мұғалім PDF шығармаларын жүктегенде осында пайда болады</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {teacherUploads.map((item, idx) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden
                      hover:border-emerald-500/20 transition-all group">
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <div className="p-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-11 h-14 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700
                          flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FileText size={18} className="text-white/80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm font-semibold leading-tight truncate">{item.title}</h3>
                          <p className="text-gray-500 text-xs mt-0.5 truncate">{item.author}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded-md bg-white/6 text-gray-500 text-[10px]">{item.genre}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">{item.gradeLevel}-сынып</span>
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-700">
                            <span>{item.teacherName}</span>
                            <span>·</span>
                            <span>{fmtSize(item.fileSizeKb)}</span>
                            <span>·</span>
                            <span>{fmtDate(item.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openBase64Pdf(item.pdfData, item.title)}
                        className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                          text-xs font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-400
                          hover:bg-emerald-500/25 transition-all">
                        <ExternalLink size={12} /> PDF ашу
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION: My personal uploads ──────────────────────────────── */}
      {activeSection === 'mine' && (
        <div>
          {myUploads.length === 0 ? (
            <div className="text-center py-20 text-gray-700">
              <Upload size={44} className="mx-auto mb-4 opacity-25" />
              <p className="text-gray-500 font-medium mb-1">Жеке PDF-тер жоқ</p>
              <p className="text-sm mb-6">Өз PDF шығармаңызды қосыңыз</p>
              <button onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-violet-500/20 border border-violet-500/40 text-violet-300
                  text-sm font-medium hover:bg-violet-500/30 transition-all">
                <Plus size={14} /> PDF қосу
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {myUploads.map((item, idx) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden
                      hover:border-violet-500/20 transition-all group">
                    <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-500" />
                    <div className="p-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-11 h-14 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700
                          flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FileText size={18} className="text-white/80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm font-semibold leading-tight truncate">{item.title}</h3>
                          <p className="text-gray-500 text-xs mt-0.5 truncate">{item.author}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-700">
                            <span>{fmtSize(item.fileSizeKb)}</span>
                            <span>·</span>
                            <span>{fmtDate(item.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openBase64Pdf(item.pdfData, item.title)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                            text-xs font-medium bg-violet-500/15 border border-violet-500/30 text-violet-400
                            hover:bg-violet-500/25 transition-all">
                          <ExternalLink size={12} /> PDF ашу
                        </button>
                        {confirmDel === item.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => { deleteUpload(item.id); setConfirmDel(null); }}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30
                                text-red-400 text-xs hover:bg-red-500/30 transition-all">
                              Жою
                            </button>
                            <button onClick={() => setConfirmDel(null)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/10
                                text-gray-500 text-xs hover:text-white transition-all">
                              Жоқ
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDel(item.id)}
                            className="p-1.5 rounded-lg bg-white/4 border border-white/8 text-gray-600
                              hover:text-red-400 hover:border-red-500/20 transition-all
                              opacity-0 group-hover:opacity-100">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && (
          <StudentUploadModal
            onSave={d => { addUpload(d); setShowUpload(false); }}
            onClose={() => setShowUpload(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
