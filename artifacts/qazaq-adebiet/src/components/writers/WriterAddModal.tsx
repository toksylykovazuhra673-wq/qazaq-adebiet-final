import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';
import { saveCustomWriter } from '@/hooks/useWriters';
import type { Writer } from '@/types/writer';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (slug: string) => void;
}

type Step = 1 | 2 | 3;

const CENTURIES = ['XIX', 'XX', 'XXI'];
const MOVEMENTS = ['Классикалық әдебиет', 'Алаш', 'Кеңес дәуірі', 'Тәуелсіздік кезеңі'];
const GENRES = ['Роман', 'Повесть', 'Әңгіме', 'Пьеса', 'Эссе', 'Балалар әдебиеті', 'Тарихи шығарма', 'Поэзия'];
const PROFESSIONS = ['Жазушы', 'Ақын', 'Драматург', 'Аудармашы', 'Журналист', 'Ғалым'];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ә]/g, 'a')
    .replace(/[ғ]/g, 'gh')
    .replace(/[қ]/g, 'q')
    .replace(/[ң]/g, 'ng')
    .replace(/[ө]/g, 'o')
    .replace(/[ү]/g, 'u')
    .replace(/[ұ]/g, 'u')
    .replace(/[і]/g, 'i')
    .replace(/[ш]/g, 'sh')
    .replace(/[ч]/g, 'ch')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

interface FormData {
  fullName: string;
  nickname: string;
  birthDate: string;
  deathDate: string;
  birthPlace: string;
  deathPlace: string;
  nationality: string;
  century: string;
  literaryMovement: string;
  genre: string[];
  profession: string[];
  description: string;
  biography: string;
  worksCount: string;
  quotesCount: string;
  tags: string;
  facts: string[];
}

const EMPTY: FormData = {
  fullName: '',
  nickname: '',
  birthDate: '',
  deathDate: '',
  birthPlace: '',
  deathPlace: '',
  nationality: 'Қазақ',
  century: 'XX',
  literaryMovement: 'Кеңес дәуірі',
  genre: ['Роман'],
  profession: ['Жазушы'],
  description: '',
  biography: '',
  worksCount: '0',
  quotesCount: '0',
  tags: '',
  facts: [''],
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/70">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-colors';

export default function WriterAddModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof FormData, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const toggleGenre = (g: string) => {
    set('genre', form.genre.includes(g) ? form.genre.filter((x) => x !== g) : [...form.genre, g]);
  };

  const toggleProfession = (p: string) => {
    set(
      'profession',
      form.profession.includes(p) ? form.profession.filter((x) => x !== p) : [...form.profession, p],
    );
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Жазушының толық атын енгізіңіз';
    if (!form.birthDate.trim()) e.birthDate = 'Туылған жылды енгізіңіз';
    if (!form.birthPlace.trim()) e.birthPlace = 'Туылған жерді енгізіңіз';
    if (form.profession.length === 0) e.profession = 'Кем дегенде бір мамандық таңдаңыз';
    if (form.genre.length === 0) e.genre = 'Кем дегенде бір жанр таңдаңыз';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = 'Қысқа сипаттама жазыңыз';
    if (!form.biography.trim()) e.biography = 'Өмірбаянын жазыңыз';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  };

  const handleSave = () => {
    setSaving(true);
    const slug = slugify(form.fullName) || `writer-${Date.now()}`;

    const writer: Writer = {
      id: Date.now(),
      slug,
      fullName: form.fullName.trim(),
      shortName: form.nickname.trim() || form.fullName.trim().split(' ').slice(0, 2).join(' '),
      nickname: form.nickname.trim() || form.fullName.trim(),
      birthDate: form.birthDate.trim(),
      deathDate: form.deathDate.trim() || null,
      birthPlace: form.birthPlace.trim(),
      deathPlace: form.deathPlace.trim() || null,
      nationality: form.nationality.trim() || 'Қазақ',
      era: `${form.century} ғасыр`,
      century: form.century,
      literaryMovement: form.literaryMovement,
      genre: form.genre.length > 0 ? form.genre : ['Роман'],
      profession: form.profession.length > 0 ? form.profession : ['Жазушы'],
      photo: '',
      coverImage: '',
      description: form.description.trim(),
      biography: form.biography.trim(),
      viewCount: 0,
      popular: false,
      featured: false,
      addedDate: new Date().toISOString().split('T')[0],
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      worksCount: parseInt(form.worksCount) || 0,
      quotesCount: parseInt(form.quotesCount) || 0,
      awards: [],
      timeline: [],
      works: [],
      novels: [],
      stories: [],
      plays: [],
      articles: [],
      quotes: [],
      gallery: [],
      videos: [],
      audio: [],
      pdf: [],
      interestingFacts: form.facts.filter((f) => f.trim()),
      relatedWriters: [],
    };

    saveCustomWriter(writer);
    setSaving(false);
    setForm(EMPTY);
    setStep(1);
    onSuccess(slug);
  };

  const handleClose = () => {
    setForm(EMPTY);
    setStep(1);
    setErrors({});
    onClose();
  };

  const stepLabels = ['Негізгі мәлімет', 'Өмірбаяны', 'Қосымша'];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0a1220] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                <div>
                  <h2 className="text-lg font-serif text-white font-semibold">Жаңа жазушы қосу</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    {step}-қадам / 3 — {stepLabels[step - 1]}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex gap-0 shrink-0">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 transition-colors ${s <= step ? 'bg-emerald-500' : 'bg-white/10'}`}
                  />
                ))}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Толық аты-жөні" required>
                          <input
                            className={inputCls}
                            placeholder="Мұхтар Әуезов"
                            value={form.fullName}
                            onChange={(e) => set('fullName', e.target.value)}
                          />
                          {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName}</p>}
                        </Field>

                        <Field label="Лақап аты / белгілі аты">
                          <input
                            className={inputCls}
                            placeholder="Мұхтар Әуезов"
                            value={form.nickname}
                            onChange={(e) => set('nickname', e.target.value)}
                          />
                        </Field>

                        <Field label="Туылған жылы" required>
                          <input
                            className={inputCls}
                            placeholder="1897"
                            value={form.birthDate}
                            onChange={(e) => set('birthDate', e.target.value)}
                          />
                          {errors.birthDate && <p className="text-red-400 text-xs">{errors.birthDate}</p>}
                        </Field>

                        <Field label="Қайтыс болған жылы">
                          <input
                            className={inputCls}
                            placeholder="1961 (тірі болса бос қалдырыңыз)"
                            value={form.deathDate}
                            onChange={(e) => set('deathDate', e.target.value)}
                          />
                        </Field>

                        <Field label="Туылған жері" required>
                          <input
                            className={inputCls}
                            placeholder="Шыңғыстау өңірі"
                            value={form.birthPlace}
                            onChange={(e) => set('birthPlace', e.target.value)}
                          />
                          {errors.birthPlace && <p className="text-red-400 text-xs">{errors.birthPlace}</p>}
                        </Field>

                        <Field label="Қайтыс болған жері">
                          <input
                            className={inputCls}
                            placeholder="Мәскеу"
                            value={form.deathPlace}
                            onChange={(e) => set('deathPlace', e.target.value)}
                          />
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Ғасыры">
                          <select
                            className={inputCls}
                            value={form.century}
                            onChange={(e) => set('century', e.target.value)}
                          >
                            {CENTURIES.map((c) => (
                              <option key={c} value={c} className="bg-[#0a1220]">
                                {c} ғасыр
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Әдеби ағым">
                          <select
                            className={inputCls}
                            value={form.literaryMovement}
                            onChange={(e) => set('literaryMovement', e.target.value)}
                          >
                            {MOVEMENTS.map((m) => (
                              <option key={m} value={m} className="bg-[#0a1220]">
                                {m}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <Field label="Мамандығы / рөлі" required>
                        <div className="flex flex-wrap gap-2">
                          {PROFESSIONS.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => toggleProfession(p)}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                form.profession.includes(p)
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                        {errors.profession && <p className="text-red-400 text-xs">{errors.profession}</p>}
                      </Field>

                      <Field label="Жанры" required>
                        <div className="flex flex-wrap gap-2">
                          {GENRES.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => toggleGenre(g)}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                form.genre.includes(g)
                                  ? 'bg-teal-600 text-white border-teal-600'
                                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                        {errors.genre && <p className="text-red-400 text-xs">{errors.genre}</p>}
                      </Field>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <Field label="Қысқа сипаттама" required>
                        <textarea
                          className={`${inputCls} resize-none`}
                          rows={3}
                          placeholder="Жазушы туралы қысқаша (2-3 сөйлем)..."
                          value={form.description}
                          onChange={(e) => set('description', e.target.value)}
                        />
                        {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
                      </Field>

                      <Field label="Толық өмірбаяны" required>
                        <textarea
                          className={`${inputCls} resize-none`}
                          rows={10}
                          placeholder="Жазушының өмірбаянын толық жазыңыз. Жаңа абзацты Enter арқылы бөліңіз..."
                          value={form.biography}
                          onChange={(e) => set('biography', e.target.value)}
                        />
                        {errors.biography && <p className="text-red-400 text-xs">{errors.biography}</p>}
                      </Field>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="Ұлты">
                          <input
                            className={inputCls}
                            placeholder="Қазақ"
                            value={form.nationality}
                            onChange={(e) => set('nationality', e.target.value)}
                          />
                        </Field>
                        <Field label="Шығармалар саны">
                          <input
                            type="number"
                            min={0}
                            className={inputCls}
                            placeholder="0"
                            value={form.worksCount}
                            onChange={(e) => set('worksCount', e.target.value)}
                          />
                        </Field>
                        <Field label="Нақыл сөздер саны">
                          <input
                            type="number"
                            min={0}
                            className={inputCls}
                            placeholder="0"
                            value={form.quotesCount}
                            onChange={(e) => set('quotesCount', e.target.value)}
                          />
                        </Field>
                      </div>

                      <Field label="Тегтер (үтірмен бөліп жазыңыз)">
                        <input
                          className={inputCls}
                          placeholder="XX ғасыр, Мектеп бағдарламасы, Жазушы"
                          value={form.tags}
                          onChange={(e) => set('tags', e.target.value)}
                        />
                      </Field>

                      <Field label="Қызықты деректер">
                        <div className="space-y-2">
                          {form.facts.map((fact, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                className={`${inputCls} flex-1`}
                                placeholder={`${i + 1}-дерек...`}
                                value={fact}
                                onChange={(e) => {
                                  const updated = [...form.facts];
                                  updated[i] = e.target.value;
                                  set('facts', updated);
                                }}
                              />
                              {form.facts.length > 1 && (
                                <button
                                  onClick={() => set('facts', form.facts.filter((_, fi) => fi !== i))}
                                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => set('facts', [...form.facts, ''])}
                            className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Дерек қосу
                          </button>
                        </div>
                      </Field>

                      {/* Preview */}
                      <div className="glass-panel rounded-xl p-4 border border-emerald-500/20">
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Алдын ала көрініс</p>
                        <p className="text-white font-serif text-xl font-semibold">{form.fullName || '—'}</p>
                        {form.nickname && (
                          <p className="text-white/50 text-sm italic">«{form.nickname}»</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {form.century} ғасыр
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30">
                            {form.literaryMovement}
                          </span>
                          {form.genre.map((g) => (
                            <span key={g} className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 text-white/60 border border-white/10">
                              {g}
                            </span>
                          ))}
                        </div>
                        <p className="text-white/60 text-sm mt-2 line-clamp-2">
                          {form.description || 'Сипаттама жоқ'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 shrink-0">
                <button
                  onClick={step === 1 ? handleClose : () => setStep((s) => (s - 1) as Step)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {step === 1 ? 'Болдырмау' : 'Артқа'}
                </button>

                {step < 3 ? (
                  <button
                    onClick={next}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Келесі
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {saving ? 'Сақталуда...' : 'Жазушыны сақтау'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
