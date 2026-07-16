import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';
import { saveCustomBi } from '@/hooks/useBi';
import type { BiSheshen } from '@/types/bi';

interface Props { open: boolean; onClose: () => void; onSuccess: (slug: string) => void; }
type Step = 1 | 2 | 3;

const CENTURIES = ['XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX'];
const PERIODS = ['Үш би дәуірі', 'Қазақ хандығы', 'Жоңғар шапқыншылығы', 'Аңырақай шайқасы', 'Ресей отаршылдығы'];
const PROFESSIONS = ['Би', 'Шешен', 'Батыр', 'Дипломат', 'Ел ақылшысы', 'Мемлекет қайраткері', 'Заң ғалымы'];

function slugify(n: string) {
  return n.toLowerCase()
    .replace(/[ə]/g,'a').replace(/[ғ]/g,'gh').replace(/[қ]/g,'q').replace(/[ң]/g,'ng')
    .replace(/[өо]/g,'o').replace(/[үу]/g,'u').replace(/[ұ]/g,'u').replace(/[і]/g,'i')
    .replace(/[ш]/g,'sh').replace(/[ч]/g,'ch').replace(/\s+/g,'-')
    .replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'');
}

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500/60 transition-colors';

const EMPTY = { fullName:'', nickname:'', birthDate:'', deathDate:'', birthPlace:'', deathPlace:'', century:'XVIII', historicalPeriod:'Үш би дәуірі', tribe:'', region:'', profession:['Би'] as string[], description:'', biography:'', oratoryCount:'0', aphorismCount:'0', tags:'', facts:[''] as string[] };
type Form = typeof EMPTY;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/70">{label}{required && <span className="text-teal-400 ml-1">*</span>}</label>
      {children}
    </div>
  );
}

export default function BiAddModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<Form>({ ...EMPTY });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: keyof Form, v: unknown) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
  const toggleP = (p: string) => set('profession', form.profession.includes(p) ? form.profession.filter(x => x !== p) : [...form.profession, p]);

  const validate1 = () => {
    const e: Record<string,string> = {};
    if (!form.fullName.trim()) e.fullName = 'Атын енгізіңіз';
    if (!form.birthDate.trim()) e.birthDate = 'Туылған жылды енгізіңіз';
    if (!form.birthPlace.trim()) e.birthPlace = 'Туылған жерді енгізіңіз';
    if (!form.tribe.trim()) e.tribe = 'Руын енгізіңіз';
    setErrors(e); return !Object.keys(e).length;
  };
  const validate2 = () => {
    const e: Record<string,string> = {};
    if (!form.description.trim()) e.description = 'Қысқа сипаттама жазыңыз';
    if (!form.biography.trim()) e.biography = 'Өмірбаянын жазыңыз';
    setErrors(e); return !Object.keys(e).length;
  };
  const next = () => { if (step === 1 && !validate1()) return; if (step === 2 && !validate2()) return; setStep(s => Math.min(3, s + 1) as Step); };

  const handleSave = () => {
    setSaving(true);
    const slug = slugify(form.fullName) || `bi-${Date.now()}`;
    const bi: BiSheshen = {
      id: Date.now(), slug,
      fullName: form.fullName.trim(), nickname: form.nickname.trim() || form.fullName.trim(),
      birthDate: form.birthDate.trim(), deathDate: form.deathDate.trim() || null,
      birthPlace: form.birthPlace.trim(), deathPlace: form.deathPlace.trim() || null,
      tribe: form.tribe.trim(), region: form.region.trim() || form.tribe.trim(),
      century: form.century, era: `${form.century} ғасыр`,
      historicalPeriod: form.historicalPeriod,
      profession: form.profession.length ? form.profession : ['Би'],
      photo: '', coverImage: '', description: form.description.trim(), biography: form.biography.trim(),
      oratoryCount: parseInt(form.oratoryCount) || 0, aphorismCount: parseInt(form.aphorismCount) || 0,
      viewCount: 0, popular: false, addedDate: new Date().toISOString().split('T')[0],
      timeline: [], oratoryWords: [], aphorisms: [], courtCases: [], diplomaticService: [],
      historicalEvents: [], gallery: [], videos: [], audio: [], pdf: [],
      mapLocation: { birthLabel: form.birthPlace.trim(), birthLat: 48, birthLng: 66.9, deathLabel: form.deathPlace.trim() || 'Белгісіз', deathLat: 48, deathLng: 66.9, livedRegions: [] },
      interestingFacts: form.facts.filter(f => f.trim()),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      relatedPersons: [],
    };
    saveCustomBi(bi);
    setSaving(false);
    setForm({ ...EMPTY }); setStep(1);
    onSuccess(slug);
  };

  const handleClose = () => { setForm({ ...EMPTY }); setStep(1); setErrors({}); onClose(); };
  const stepLabels = ['Негізгі мәлімет', 'Өмірбаяны', 'Қосымша'];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0f0a22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                <div>
                  <h2 className="text-lg font-serif text-white font-semibold">Жаңа би-шешен қосу</h2>
                  <p className="text-xs text-white/50 mt-0.5">{step}-қадам / 3 — {stepLabels[step - 1]}</p>
                </div>
                <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {/* Progress bar */}
              <div className="flex gap-0 shrink-0">
                {[1,2,3].map(s => <div key={s} className={`h-1 flex-1 transition-colors ${s <= step ? 'bg-teal-500' : 'bg-white/10'}`} />)}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Толық аты-жөні" required><input className={inputCls} placeholder="Төле Әліұлы" value={form.fullName} onChange={e => set('fullName', e.target.value)} />{errors.fullName && <p className="text-red-400 text-xs">{errors.fullName}</p>}</Field>
                        <Field label="Лақап аты"><input className={inputCls} placeholder="Төле би" value={form.nickname} onChange={e => set('nickname', e.target.value)} /></Field>
                        <Field label="Туылған жылы" required><input className={inputCls} placeholder="1663" value={form.birthDate} onChange={e => set('birthDate', e.target.value)} />{errors.birthDate && <p className="text-red-400 text-xs">{errors.birthDate}</p>}</Field>
                        <Field label="Қайтыс болған жылы"><input className={inputCls} placeholder="1756 (белгісіз болса бос)" value={form.deathDate} onChange={e => set('deathDate', e.target.value)} /></Field>
                        <Field label="Туылған жері" required><input className={inputCls} placeholder="Жетісу өңірі" value={form.birthPlace} onChange={e => set('birthPlace', e.target.value)} />{errors.birthPlace && <p className="text-red-400 text-xs">{errors.birthPlace}</p>}</Field>
                        <Field label="Қайтыс болған жері"><input className={inputCls} placeholder="Жетісу" value={form.deathPlace} onChange={e => set('deathPlace', e.target.value)} /></Field>
                        <Field label="Руы" required><input className={inputCls} placeholder="Ысты (Ұлы жүз)" value={form.tribe} onChange={e => set('tribe', e.target.value)} />{errors.tribe && <p className="text-red-400 text-xs">{errors.tribe}</p>}</Field>
                        <Field label="Аймағы"><input className={inputCls} placeholder="Жетісу" value={form.region} onChange={e => set('region', e.target.value)} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Ғасыры">
                          <select className={inputCls} value={form.century} onChange={e => set('century', e.target.value)}>
                            {CENTURIES.map(c => <option key={c} value={c} className="bg-[#0f0a22]">{c} ғасыр</option>)}
                          </select>
                        </Field>
                        <Field label="Тарихи дәуірі">
                          <select className={inputCls} value={form.historicalPeriod} onChange={e => set('historicalPeriod', e.target.value)}>
                            {PERIODS.map(p => <option key={p} value={p} className="bg-[#0f0a22]">{p}</option>)}
                          </select>
                        </Field>
                      </div>
                      <Field label="Мамандығы / рөлі">
                        <div className="flex flex-wrap gap-2">
                          {PROFESSIONS.map(p => (
                            <button key={p} type="button" onClick={() => toggleP(p)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.profession.includes(p) ? 'bg-teal-500 text-white border-teal-500' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'}`}>{p}</button>
                          ))}
                        </div>
                      </Field>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <Field label="Қысқа сипаттама" required><textarea className={`${inputCls} resize-none`} rows={3} placeholder="Тұлға туралы қысқаша (2-3 сөйлем)..." value={form.description} onChange={e => set('description', e.target.value)} />{errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}</Field>
                      <Field label="Толық өмірбаяны" required><textarea className={`${inputCls} resize-none`} rows={10} placeholder="Өмірбаянын толық жазыңыз..." value={form.biography} onChange={e => set('biography', e.target.value)} />{errors.biography && <p className="text-red-400 text-xs">{errors.biography}</p>}</Field>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Шешендік сөздер саны"><input type="number" min={0} className={inputCls} placeholder="0" value={form.oratoryCount} onChange={e => set('oratoryCount', e.target.value)} /></Field>
                        <Field label="Нақыл сөздер саны"><input type="number" min={0} className={inputCls} placeholder="0" value={form.aphorismCount} onChange={e => set('aphorismCount', e.target.value)} /></Field>
                      </div>
                      <Field label="Тегтер (үтірмен бөліп жазыңыз)"><input className={inputCls} placeholder="XVIII ғасыр, Үш би, Мектеп бағдарламасы" value={form.tags} onChange={e => set('tags', e.target.value)} /></Field>
                      <Field label="Қызықты деректер">
                        <div className="space-y-2">
                          {form.facts.map((fact, i) => (
                            <div key={i} className="flex gap-2">
                              <input className={`${inputCls} flex-1`} placeholder={`${i+1}-дерек...`} value={fact} onChange={e => { const u = [...form.facts]; u[i] = e.target.value; set('facts', u); }} />
                              {form.facts.length > 1 && <button onClick={() => set('facts', form.facts.filter((_,fi) => fi !== i))} className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          ))}
                          <button onClick={() => set('facts', [...form.facts, ''])} className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors"><Plus className="w-4 h-4" />Дерек қосу</button>
                        </div>
                      </Field>
                      {/* Preview */}
                      <div className="glass-panel rounded-xl p-4 border border-teal-500/15">
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Алдын ала көрініс</p>
                        <p className="text-white font-serif text-xl font-semibold">{form.fullName || '—'}</p>
                        {form.nickname && <p className="text-white/50 text-sm italic">«{form.nickname}»</p>}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-teal-500/15 text-teal-400 border border-teal-500/25">{form.century} ғасыр</span>
                          {form.tribe && <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">{form.tribe}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 shrink-0">
                <button onClick={step === 1 ? handleClose : () => setStep(s => (s-1) as Step)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"><ChevronLeft className="w-4 h-4" />{step === 1 ? 'Болдырмау' : 'Артқа'}</button>
                {step < 3
                  ? <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-lg">Келесі<ChevronRight className="w-4 h-4" /></button>
                  : <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg disabled:opacity-50"><Check className="w-4 h-4" />{saving ? 'Сақталуда...' : 'Сақтау'}</button>
                }
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
