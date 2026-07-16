import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, FileType, Check, Loader2, ChevronDown,
  BookOpen, User, Tag, Hash, Globe,
} from 'lucide-react';
import { saveUploadedPdf, slugify, type StoredPdfBook } from '@/db/pdfStorage';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Классикалық әдебиет', 'Роман-эпопея', 'Поэзия', 'Оқулық',
  'Шешендік өнер', 'Ғылыми еңбек', 'Балалар әдебиеті', 'Тарих',
  'Философия', 'Өзге',
];

const LANGUAGES = ['Қазақша', 'Орысша', 'Ағылшынша', 'Басқа'];

export default function PdfUploadModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'drop' | 'meta' | 'saving' | 'done'>('drop');
  const [file, setFile]     = useState<File | null>(null);
  const [dragging, setDrag] = useState(false);
  const [error, setError]   = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title,    setTitle]    = useState('');
  const [author,   setAuthor]   = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [year,     setYear]     = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [grade,    setGrade]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [allowDl,  setAllowDl]  = useState(true);

  const reset = () => {
    setStep('drop'); setFile(null); setError('');
    setTitle(''); setAuthor(''); setYear(''); setGrade(''); setDesc('');
    setCategory(CATEGORIES[0]); setLanguage(LANGUAGES[0]); setAllowDl(true);
  };

  const handleClose = () => { reset(); onClose(); };

  const acceptFile = (f: File) => {
    if (f.type !== 'application/pdf') { setError('Тек PDF файл жүктеңіз'); return; }
    if (f.size > 100 * 1024 * 1024) { setError('Файл өлшемі 100 МБ-тан аспауы керек'); return; }
    setFile(f);
    setTitle(f.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
    setError('');
    setStep('meta');
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!file || !title.trim() || !author.trim()) {
      setError('Атауы мен автор атын толтырыңыз');
      return;
    }
    setStep('saving');
    setError('');
    try {
      const slug = slugify(`${author}-${title}-${Date.now()}`);
      const buf  = await file.arrayBuffer();

      const book: Omit<StoredPdfBook, 'blobKey'> = {
        id: Date.now(),
        slug,
        title:        title.trim(),
        author:       author.trim(),
        category,
        pages:        0,
        year:         year.trim(),
        cover:        '',
        pdfFile:      slug,
        description:  desc.trim(),
        grade:        grade.trim(),
        language,
        allowDownload: allowDl,
        tableOfContents: [],
        tags:         [],
        fileSize:     file.size,
        addedAt:      new Date().toISOString(),
        userUploaded: true,
      };

      await saveUploadedPdf(book, buf);
      setStep('done');
      setTimeout(() => { reset(); onSuccess(); onClose(); }, 1200);
    } catch (err: any) {
      setError(err?.message ?? 'Сақтау қатесі');
      setStep('meta');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-white font-semibold text-base flex items-center gap-2">
                <Upload size={18} className="text-violet-400" />
                PDF кітап қосу
              </h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* ─── Step 1: Drop zone ─── */}
                {step === 'drop' && (
                  <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div
                      onDragOver={e => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                        dragging
                          ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
                          : 'border-white/15 hover:border-white/30 hover:bg-white/3'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${
                        dragging ? 'bg-violet-500/20' : 'bg-white/5'
                      }`}>
                        <FileType size={30} className={dragging ? 'text-violet-300' : 'text-gray-400'} />
                      </div>
                      <p className="text-white font-semibold mb-1">PDF файлды осында сүйреңіз</p>
                      <p className="text-gray-500 text-sm mb-4">немесе файл таңдау үшін басыңыз</p>
                      <span className="px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm">
                        Файл таңдау
                      </span>
                      <p className="text-gray-600 text-xs mt-4">PDF • Максимум 100 МБ</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="application/pdf" onChange={onInputChange} className="hidden" />
                    {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
                  </motion.div>
                )}

                {/* ─── Step 2: Metadata ─── */}
                {step === 'meta' && file && (
                  <motion.div key="meta" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    {/* File info bar */}
                    <div className="flex items-center gap-3 p-3 bg-green-500/8 border border-green-500/20 rounded-xl mb-5">
                      <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                        <FileType size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
                      </div>
                      <button onClick={() => { setFile(null); setStep('drop'); }} className="text-gray-500 hover:text-gray-300">
                        <X size={15} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Title */}
                      <Field icon={<BookOpen size={14} />} label="Кітап атауы *">
                        <input value={title} onChange={e => setTitle(e.target.value)}
                          placeholder="Мысалы: Абайдың қара сөздері"
                          className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
                      </Field>

                      {/* Author */}
                      <Field icon={<User size={14} />} label="Автор *">
                        <input value={author} onChange={e => setAuthor(e.target.value)}
                          placeholder="Мысалы: Абай Құнанбайұлы"
                          className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Category */}
                        <Field icon={<Tag size={14} />} label="Санат">
                          <div className="relative">
                            <select value={category} onChange={e => setCategory(e.target.value)}
                              className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none pr-5">
                              {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          </div>
                        </Field>

                        {/* Year */}
                        <Field icon={<Hash size={14} />} label="Жылы">
                          <input value={year} onChange={e => setYear(e.target.value)}
                            placeholder="2024" maxLength={4}
                            className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Language */}
                        <Field icon={<Globe size={14} />} label="Тілі">
                          <div className="relative">
                            <select value={language} onChange={e => setLanguage(e.target.value)}
                              className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none pr-5">
                              {LANGUAGES.map(l => <option key={l} value={l} className="bg-gray-800">{l}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          </div>
                        </Field>

                        {/* Grade */}
                        <Field icon={<Hash size={14} />} label="Сынып">
                          <input value={grade} onChange={e => setGrade(e.target.value)}
                            placeholder="9-11 сынып"
                            className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none" />
                        </Field>
                      </div>

                      {/* Description */}
                      <Field icon={<BookOpen size={14} />} label="Сипаттамасы">
                        <textarea value={desc} onChange={e => setDesc(e.target.value)}
                          placeholder="Қысқаша сипаттама..." rows={2}
                          className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none resize-none" />
                      </Field>

                      {/* Allow download */}
                      <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors">
                        <div
                          onClick={() => setAllowDl(v => !v)}
                          className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${allowDl ? 'bg-violet-500' : 'bg-gray-700'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${allowDl ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-gray-300 text-sm">Жүктеуге рұқсат ету</span>
                      </label>
                    </div>

                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                    <div className="flex gap-3 mt-5">
                      <button onClick={() => { setStep('drop'); setFile(null); }}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition-colors">
                        Артқа
                      </button>
                      <button onClick={handleSave}
                        className="flex-1 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold text-sm transition-colors">
                        Сақтау
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── Step 3: Saving ─── */}
                {step === 'saving' && (
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-12">
                    <Loader2 size={40} className="animate-spin text-violet-400 mx-auto mb-4" />
                    <p className="text-white font-medium">PDF сақталуда...</p>
                    <p className="text-gray-500 text-sm mt-1">Браузер жадына жүктелуде</p>
                  </motion.div>
                )}

                {/* ─── Step 4: Done ─── */}
                {step === 'done' && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                      <Check size={30} className="text-green-400" />
                    </div>
                    <p className="text-white font-semibold text-lg">Сәтті сақталды!</p>
                    <p className="text-gray-400 text-sm mt-1">Кітап кітапханаға қосылды</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-xl px-3 py-2.5">
      <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
        {icon}{label}
      </p>
      {children}
    </div>
  );
}
