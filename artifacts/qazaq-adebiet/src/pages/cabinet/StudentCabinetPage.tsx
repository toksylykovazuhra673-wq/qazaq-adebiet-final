import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  LayoutDashboard, BookOpen, Target, TrendingUp, Award, Trophy,
  ChevronLeft, User, Edit3, Check, X, Zap, Flame,
} from 'lucide-react';

import { useProgress } from '@/hooks/useProgress';
import {
  useStudentCabinet,
  loadReadingRecords,
  loadTestRecords,
  buildCertificates,
} from '@/hooks/useStudentCabinet';

import CabDashboard    from './tabs/CabDashboard';
import CabLibrary      from './tabs/CabLibrary';
import CabTests        from './tabs/CabTests';
import CabProgress     from './tabs/CabProgress';
import CabCertificates from './tabs/CabCertificates';
import CabOlympiada    from './tabs/CabOlympiada';

import type { CabTab } from '@/types/student';

// ── Tab config ─────────────────────────────────────────────────────────────
const TABS: { id: CabTab; label: string; labelShort: string; Icon: React.ElementType }[] = [
  { id: 'dashboard',    label: 'Басты бет',      labelShort: 'Басты',    Icon: LayoutDashboard },
  { id: 'library',      label: 'Кітапхана',      labelShort: 'Кітап',    Icon: BookOpen        },
  { id: 'tests',        label: 'Тесттер',         labelShort: 'Тест',     Icon: Target          },
  { id: 'progress',     label: 'Прогресс',        labelShort: 'Прогресс', Icon: TrendingUp      },
  { id: 'certificates', label: 'Сертификаттар',   labelShort: 'Серт.',    Icon: Award           },
  { id: 'olympiad',     label: 'Олимпиада',       labelShort: 'Олимп.',   Icon: Trophy          },
];

// ── Profile Edit Modal ──────────────────────────────────────────────────────
function ProfileModal({
  profile, onSave, onClose,
}: {
  profile: { name: string; grade: string; school: string };
  onSave: (p: { name: string; grade: string; school: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(profile);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <User size={18} className="text-violet-400" /> Профиль редактирлеу
        </h2>
        <div className="space-y-3">
          {[
            { key: 'name',   label: 'Аты-жөні',   placeholder: 'Мысалы: Айгерім Бекова' },
            { key: 'grade',  label: 'Сынып',       placeholder: 'Мысалы: 9-сынып'        },
            { key: 'school', label: 'Мектеп',      placeholder: 'Мектеп атауы'            },
          ].map(f => (
            <div key={f.key}>
              <label className="text-gray-500 text-xs block mb-1">{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm
                  text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2">
            <X size={14} /> Болдырмау
          </button>
          <button onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold
              transition-all flex items-center justify-center gap-2">
            <Check size={14} /> Сақтау
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function StudentCabinetPage() {
  const [activeTab, setActiveTab] = useState<CabTab>('dashboard');
  const [, navigate] = useLocation();

  const {
    profile, editingProfile, setEditingProfile, saveProfile,
    readingRecords, testRecords,
  } = useStudentCabinet();

  const {
    progress, level, xpInLevel, xpPerLevel,
    completedCount, getAchievements,
  } = useProgress();

  const achievements = getAchievements();
  const certificates = buildCertificates(achievements, readingRecords, testRecords, progress.streak ?? 0);
  const streak       = progress.streak ?? 0;

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as CabTab);
  }, []);

  const activeTabMeta = TABS.find(t => t.id === activeTab) ?? TABS[0];

  return (
    <div className="dark min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Back + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-600 text-sm">QazaqAdebiet</span>
              <span className="text-gray-700">·</span>
              <span className="text-white text-sm font-medium">Оқушы кабинеті</span>
            </div>
            <span className="sm:hidden text-white text-sm font-medium">Кабинет</span>
          </div>

          {/* Profile chip */}
          <button
            onClick={() => setEditingProfile(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10
              hover:bg-white/8 transition-all group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
              flex items-center justify-center text-xs font-bold text-white">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-white text-xs font-medium leading-none">{profile.name}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">{profile.grade}</div>
            </div>
            {/* XP badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25">
              <Zap size={10} className="text-violet-400" />
              <span className="text-violet-300 text-[10px] font-bold">{progress.xp ?? 0}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-0.5 text-orange-400 text-[10px] font-medium">
                <Flame size={10} />{streak}
              </div>
            )}
            <Edit3 size={11} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 pt-6 pr-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Avatar card */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-4 mb-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600
              flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 shadow-lg">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-white font-semibold text-sm">{profile.name}</div>
            <div className="text-gray-500 text-xs mt-0.5">{profile.grade}</div>
            <div className="text-gray-600 text-[11px]">{profile.school}</div>
            {/* XP bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                <span>{level}-деңгей</span>
                <span>{Math.round((xpInLevel / xpPerLevel) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (xpInLevel / xpPerLevel) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="space-y-1">
            {TABS.map(tab => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                    transition-all text-left ${
                    active
                      ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}>
                  <tab.Icon size={16} className={active ? 'text-violet-400' : ''} />
                  {tab.label}
                  {tab.id === 'certificates' && certificates.length > 0 && (
                    <span className="ml-auto text-[10px] bg-amber-500/20 border border-amber-500/30
                      text-amber-400 px-1.5 py-0.5 rounded-full">{certificates.length}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer note */}
          <div className="mt-auto pb-6 pt-4 text-[10px] text-gray-700 leading-relaxed">
            Деректер тек осы құрылғыда сақталады. Оқу жалғастыру үшін бір браузер пайдалан.
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-6 px-0 lg:pl-6">
          {/* Page title (desktop) */}
          <div className="hidden lg:flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center">
              <activeTabMeta.Icon size={17} className="text-gray-400" />
            </div>
            <h1 className="text-xl font-bold text-white">{activeTabMeta.label}</h1>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}>
              {activeTab === 'dashboard' && (
                <CabDashboard
                  profile={profile}
                  progress={progress}
                  level={level}
                  xpInLevel={xpInLevel}
                  xpPerLevel={xpPerLevel}
                  readingRecords={readingRecords}
                  testRecords={testRecords}
                  onTabChange={handleTabChange}
                />
              )}
              {activeTab === 'library' && (
                <CabLibrary readingRecords={readingRecords} />
              )}
              {activeTab === 'tests' && (
                <CabTests testRecords={testRecords} />
              )}
              {activeTab === 'progress' && (
                <CabProgress
                  progress={progress}
                  level={level}
                  xpInLevel={xpInLevel}
                  xpPerLevel={xpPerLevel}
                  completedCount={completedCount}
                  achievements={achievements}
                />
              )}
              {activeTab === 'certificates' && (
                <CabCertificates
                  certificates={certificates}
                  studentName={profile.name}
                  grade={profile.grade}
                />
              )}
              {activeTab === 'olympiad' && (
                <CabOlympiada
                  progress={progress}
                  level={level}
                  completedCount={completedCount}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden sticky bottom-0 z-30 bg-gray-950/95 backdrop-blur-xl border-t border-white/8
        flex items-stretch safe-area-pb">
        {TABS.map(tab => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all relative ${
                active ? 'text-violet-400' : 'text-gray-600 hover:text-gray-400'
              }`}>
              {active && (
                <motion.div
                  layoutId="mob-tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-500 rounded-full"
                />
              )}
              <tab.Icon size={18} />
              <span className="text-[9px] font-medium leading-none">{tab.labelShort}</span>
              {tab.id === 'certificates' && certificates.length > 0 && (
                <span className="absolute top-1.5 right-1/4 w-3.5 h-3.5 bg-amber-500 rounded-full
                  text-[8px] text-black font-bold flex items-center justify-center">
                  {certificates.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile edit modal */}
      <AnimatePresence>
        {editingProfile && (
          <ProfileModal
            profile={profile}
            onSave={saveProfile}
            onClose={() => setEditingProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
