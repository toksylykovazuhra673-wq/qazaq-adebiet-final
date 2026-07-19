import { useState, useEffect, useCallback } from 'react';
import type { GeneratedLesson } from '@/utils/lessonPlanGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'wouter';
import { Sparkles } from 'lucide-react';

import { useAnalysis } from '@/hooks/useAnalysis';
import AnalysisLoadingSkeleton from '@/components/analysis/LoadingSkeleton';
import AnalysisTopBar          from '@/components/analysis/AnalysisTopBar';
import AnalysisHero            from '@/components/analysis/AnalysisHero';
import AnalysisQuickActions    from '@/components/analysis/AnalysisQuickActions';
import AnalysisTabBar          from '@/components/analysis/AnalysisTabBar';

// ── Tab components ────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// ── Tab content renderer ──────────────────────────────────────
// ─────────────────────────────────────────────────────────────
interface TabContentProps {
  tabId: string;
  analysis: ReturnType<typeof useAnalysis>['analysis'];
  workSlug: string;
  customLesson: GeneratedLesson | null;
  onGenerate: (lesson: GeneratedLesson) => void;
  onGoToStudent: () => void;
}

function TabContent({ tabId, analysis, workSlug, customLesson, onGenerate, onGoToStudent }: TabContentProps) {
  // 'auto' tab always works — even without database analysis
  if (tabId === 'auto') {
    return <TabAutoAnalysis analysis={analysis} workSlug={workSlug} />;
  }

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
    default:            return <TabGeneral analysis={analysis} />;
  }
}

// ─────────────────────────────────────────────────────────────
// ── "Not in database" state — shows auto tab ─────────────────
// ─────────────────────────────────────────────────────────────
function AutoOnlyShell({ workSlug, activeTab, onTabChange }: {
  workSlug: string; activeTab: string; onTabChange: (id: string) => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950">
      {/* Minimal top bar */}
      <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/8 px-4 py-3 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="text-white/40 hover:text-white text-sm transition-colors">
          ← Артқа
        </button>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center">
            <Sparkles size={11} className="text-violet-400" />
          </div>
          <span className="text-white/70 text-sm font-medium">Автоматты талдау</span>
          <span className="text-white/25 text-xs">— {workSlug}</span>
        </div>
      </div>

      {/* Tab bar */}
      <AnalysisTabBar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TabAutoAnalysis analysis={null} workSlug={workSlug} />
          </motion.div>
        </AnimatePresence>
        <div className="h-24" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── Main Page ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const params   = useParams<{ workSlug: string }>();
  const workSlug = params.workSlug ?? '';
  const { analysis, loading } = useAnalysis(workSlug);

  // Default to 'auto' when no database analysis found, else 'general'
  const defaultTab = analysis ? 'general' : 'auto';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [customLesson, setCustomLesson] = useState<GeneratedLesson | null>(null);

  // Sync default tab when analysis loads
  useEffect(() => {
    if (!loading) {
      setActiveTab(analysis ? 'general' : 'auto');
    }
  }, [analysis, loading]);

  const handleGenerate   = useCallback((lesson: GeneratedLesson) => setCustomLesson(lesson), []);
  const handleGoToStudent = useCallback(() => setActiveTab('student'), []);

  useEffect(() => {
    if (analysis) document.title = `Талдау: ${analysis.title}`;
    else if (workSlug) document.title = `Автоматты талдау: ${workSlug}`;
    return () => { document.title = 'QazaqAdebiet'; };
  }, [analysis, workSlug]);

  if (loading) return <AnalysisLoadingSkeleton />;

  // No database entry — show auto-only shell
  if (!analysis) {
    return <AutoOnlyShell workSlug={workSlug} activeTab={activeTab} onTabChange={setActiveTab} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950 print:bg-white">

      {/* Print header */}
      <div className="hidden print:block p-8 border-b mb-6">
        <h1 className="text-2xl font-bold">{analysis.title} — Әдеби талдау</h1>
        <p className="text-gray-500 mt-1">{analysis.author} · {analysis.period}</p>
      </div>

      {/* Apple Books style top bar */}
      <AnalysisTopBar analysis={analysis} />

      {/* Hero section */}
      <AnalysisHero analysis={analysis} />

      {/* Quick actions */}
      <AnalysisQuickActions analysis={analysis} onTabChange={setActiveTab} />

      {/* Tab navigation */}
      <AnalysisTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
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
              workSlug={workSlug}
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
