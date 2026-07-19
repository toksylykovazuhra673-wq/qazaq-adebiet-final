import { useState, useEffect, useCallback } from 'react';
import type { GeneratedLesson } from '@/utils/lessonPlanGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'wouter';
import { AlertCircle } from 'lucide-react';

import { useAnalysis } from '@/hooks/useAnalysis';
import AnalysisLoadingSkeleton from '@/components/analysis/LoadingSkeleton';
import AnalysisTopBar          from '@/components/analysis/AnalysisTopBar';
import AnalysisHero            from '@/components/analysis/AnalysisHero';
import AnalysisQuickActions    from '@/components/analysis/AnalysisQuickActions';
import AnalysisTabBar          from '@/components/analysis/AnalysisTabBar';

// ── Tab components ───────────────────────────────────────────
import TabGeneral      from '@/components/analysis/tabs/TabGeneral';
import TabSummary      from '@/components/analysis/tabs/TabSummary';
import TabTheme        from '@/components/analysis/tabs/TabTheme';
import TabAuthor       from '@/components/analysis/tabs/TabAuthor';
import TabPoemStructure from '@/components/analysis/tabs/TabPoemStructure';
import TabPhilosophy   from '@/components/analysis/tabs/TabPhilosophy';
import TabEducational  from '@/components/analysis/tabs/TabEducational';
import TabModern       from '@/components/analysis/tabs/TabModern';
import TabTest         from '@/components/analysis/tabs/TabTest';
import TabInteractive  from '@/components/analysis/tabs/TabInteractive';
import TabOlympiad     from '@/components/analysis/tabs/TabOlympiad';
import TabSynopsis     from '@/components/analysis/tabs/TabSynopsis';
import TabTeacher      from '@/components/analysis/tabs/TabTeacher';
import TabStudent      from '@/components/analysis/tabs/TabStudent';
import TabMedia        from '@/components/analysis/tabs/TabMedia';
import TabAutoAnalysis  from '@/components/analysis/tabs/TabAutoAnalysis';
import {
  TabComposition, TabPlot, TabCharacters, TabLanguage,
  TabDevices, TabTheory, TabHistorical, TabFacts,
} from '@/components/analysis/tabs/TabWrap';

// ── Not-found state ──────────────────────────────────────────
function NotFoundState({ workSlug }: { workSlug: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-white/30" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Талдау табылмады</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-4">
          «{workSlug}» шығармасының талдауы әлі дайын емес. Жаңа талдау қосу үшін{' '}
          <code className="text-violet-400 bg-violet-400/10 px-1 rounded">
            src/data/analysis.json
          </code>{' '}
          файлына жаңа объект енгізіңіз.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
        >
          Артқа оралу
        </button>
      </div>
    </div>
  );
}

// ── Tab content renderer ─────────────────────────────────────
interface TabContentProps {
  tabId: string;
  analysis: ReturnType<typeof useAnalysis>['analysis'];
  customLesson: GeneratedLesson | null;
  onGenerate: (lesson: GeneratedLesson) => void;
  onGoToStudent: () => void;
}

function TabContent({ tabId, analysis, customLesson, onGenerate, onGoToStudent }: TabContentProps) {
  if (!analysis) return null;
  switch (tabId) {
    case 'general':     return <TabGeneral analysis={analysis} />;
    case 'summary':     return <TabSummary analysis={analysis} />;
    case 'theme':       return <TabTheme analysis={analysis} />;
    case 'composition': return <TabComposition analysis={analysis} />;
    case 'plot':        return <TabPlot analysis={analysis} />;
    case 'characters':  return <TabCharacters analysis={analysis} />;
    case 'author':      return <TabAuthor analysis={analysis} />;
    case 'language':    return <TabLanguage analysis={analysis} />;
    case 'devices':     return <TabDevices analysis={analysis} />;
    case 'poem':        return <TabPoemStructure analysis={analysis} />;
    case 'theory':      return <TabTheory analysis={analysis} />;
    case 'historical':  return <TabHistorical analysis={analysis} />;
    case 'philosophy':  return <TabPhilosophy analysis={analysis} />;
    case 'educational': return <TabEducational analysis={analysis} />;
    case 'modern':      return <TabModern analysis={analysis} />;
    case 'facts':       return <TabFacts analysis={analysis} />;
    case 'test':        return <TabTest analysis={analysis} />;
    case 'interactive': return <TabInteractive analysis={analysis} />;
    case 'olympiad':    return <TabOlympiad analysis={analysis} />;
    case 'synopsis':    return <TabSynopsis analysis={analysis} />;
    case 'teacher':     return <TabTeacher analysis={analysis} customLesson={customLesson} onGenerate={onGenerate} onGoToStudent={onGoToStudent} />;
    case 'student':     return <TabStudent analysis={analysis} customLesson={customLesson} />;
    case 'media':       return <TabMedia analysis={analysis} />;
    case 'auto':        return <TabAutoAnalysis />;
    default:            return <TabGeneral analysis={analysis} />;
  }
}

// ── Main Page ────────────────────────────────────────────────
export default function AnalysisPage() {
  const params  = useParams<{ workSlug: string }>();
  const workSlug = params.workSlug ?? '';
  const { analysis, loading } = useAnalysis(workSlug);
  const [activeTab, setActiveTab] = useState('general');
  const [customLesson, setCustomLesson] = useState<GeneratedLesson | null>(null);

  const handleGenerate = useCallback((lesson: GeneratedLesson) => {
    setCustomLesson(lesson);
  }, []);

  const handleGoToStudent = useCallback(() => {
    setActiveTab('student');
  }, []);

  useEffect(() => {
    if (analysis) document.title = `Талдау: ${analysis.title}`;
    return () => { document.title = 'QazaqAdebiet'; };
  }, [analysis]);

  if (loading)   return <AnalysisLoadingSkeleton />;
  if (!analysis) return <NotFoundState workSlug={workSlug} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950 print:bg-white">

      {/* Print header */}
      <div className="hidden print:block p-8 border-b mb-6">
        <h1 className="text-2xl font-bold">{analysis.title} — Әдеби талдау</h1>
        <p className="text-gray-500 mt-1">{analysis.author} · {analysis.period}</p>
      </div>

      {/* ── Apple Books style top bar ── */}
      <AnalysisTopBar analysis={analysis} />

      {/* ── Hero section ── */}
      <AnalysisHero analysis={analysis} />

      {/* ── Quick actions ── */}
      <AnalysisQuickActions analysis={analysis} onTabChange={setActiveTab} />

      {/* ── Tab navigation ── */}
      <AnalysisTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Tab content ── */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TabContent
              tabId={activeTab}
              analysis={analysis}
              customLesson={customLesson}
              onGenerate={handleGenerate}
              onGoToStudent={handleGoToStudent}
            />
          </motion.div>
        </AnimatePresence>
        <div className="h-24" />
      </div>
    </div>
  );
}
