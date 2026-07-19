import { lazy, Suspense, memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  RouteFallback, GridPageSkeleton, DashboardPageSkeleton, ReaderPageSkeleton,
} from '@/components/PageSkeleton';

// ── Lazy page imports (code splitting) ───────────────────────────────────────
// Core — eager (tiny, needed immediately)
import HomePage   from '@/pages/HomePage';
import NotFound   from '@/pages/not-found';

// Literature section
const PoetsPage         = lazy(() => import('@/pages/poets/PoetsPage'));
const PoetDetailPage    = lazy(() => import('@/pages/poets/PoetDetailPage'));
const WritersPage       = lazy(() => import('@/pages/writers/WritersPage'));
const WriterDetailPage  = lazy(() => import('@/pages/writers/WriterDetailPage'));
const ZhyrauPage        = lazy(() => import('@/pages/zhyrau/ZhyrauPage'));
const ZhyrauDetailPage  = lazy(() => import('@/pages/zhyrau/ZhyrauDetailPage'));
const BiPage            = lazy(() => import('@/pages/bi/BiPage'));
const BiDetailPage      = lazy(() => import('@/pages/bi/BiDetailPage'));
const EducatorPage      = lazy(() => import('@/pages/educator/EducatorPage'));
const EducatorDetailPage= lazy(() => import('@/pages/educator/EducatorDetailPage'));
const UniversalAuthorPage = lazy(() => import('@/pages/universal/UniversalAuthorPage'));
const WorkDetailPage    = lazy(() => import('@/pages/universal/WorkDetailPage'));
const AuthorDetailPage  = lazy(() => import('@/pages/AuthorDetailPage'));

// Reader section (heavy — own chunk)
const PdfLibraryPage    = lazy(() => import('@/pages/reader/PdfLibraryPage'));
const PdfReaderPage     = lazy(() => import('@/pages/reader/PdfReaderPage'));
const DigitalReaderPage = lazy(() => import('@/pages/reader/DigitalReaderPage'));
const WorkPdfReaderPage = lazy(() => import('@/pages/reader/WorkPdfReaderPage'));

// Analysis (own chunk)
const AnalysisPage      = lazy(() => import('@/pages/analysis/AnalysisPage'));
const FreeAnalysisPage  = lazy(() => import('@/pages/analysis/FreeAnalysisPage'));

// Interactive / Games (own chunk)
const InteractivePage   = lazy(() => import('@/pages/interactive/InteractivePage'));

// User modules (own chunk)
const StudentCabinetPage   = lazy(() => import('@/pages/cabinet/StudentCabinetPage'));
const TeacherDashboardPage = lazy(() => import('@/pages/teacher/TeacherDashboardPage'));

// ── QueryClient (with performance-tuned defaults) ────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:       5  * 60 * 1000,  // 5 min
      gcTime:          15 * 60 * 1000,  // 15 min
      retry:           1,
      refetchOnWindowFocus: false,
    },
  },
});

// ── Layout shell ─────────────────────────────────────────────────────────────
const AppShell = memo(function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
});

// ── Suspense wrappers ─────────────────────────────────────────────────────────
function Page({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
function GridPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<GridPageSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
function ReaderPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ReaderPageSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
function DashPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardPageSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Switch>
      {/* HomePage — eager */}
      <Route path="/" component={HomePage} />

      {/* ── Legacy URL aliases ─────────────────────────────────────────── */}
      <Route path="/aqyndar">
        {() => <GridPage><AppShell><PoetsPage /></AppShell></GridPage>}
      </Route>
      <Route path="/zhazushylar">
        {() => <GridPage><AppShell><WritersPage /></AppShell></GridPage>}
      </Route>
      <Route path="/zhyraudar">
        {() => <GridPage><AppShell><ZhyrauPage /></AppShell></GridPage>}
      </Route>
      <Route path="/kitapkhana">
        {() => <GridPage><AppShell><PdfLibraryPage /></AppShell></GridPage>}
      </Route>
      <Route path="/taldau">
        {() => <Page><AppShell><FreeAnalysisPage /></AppShell></Page>}
      </Route>
      <Route path="/oyyndar">
        {() => <Page><InteractivePage /></Page>}
      </Route>
      <Route path="/olimpiada">
        {() => <Page><InteractivePage /></Page>}
      </Route>

      {/* ── Poets ──────────────────────────────────────────────────────── */}
      <Route path="/poets">
        {() => <GridPage><AppShell><PoetsPage /></AppShell></GridPage>}
      </Route>
      <Route path="/poets/:slug">
        {() => <Page><AppShell><PoetDetailPage /></AppShell></Page>}
      </Route>

      {/* ── Writers ────────────────────────────────────────────────────── */}
      <Route path="/writers">
        {() => <GridPage><AppShell><WritersPage /></AppShell></GridPage>}
      </Route>
      <Route path="/writers/:slug">
        {() => <Page><AppShell><WriterDetailPage /></AppShell></Page>}
      </Route>

      {/* ── Bi-sheshender ──────────────────────────────────────────────── */}
      <Route path="/bi-sheshender">
        {() => <GridPage><AppShell><BiPage /></AppShell></GridPage>}
      </Route>
      <Route path="/bi-sheshender/:slug">
        {() => <Page><AppShell><BiDetailPage /></AppShell></Page>}
      </Route>

      {/* ── Educators ──────────────────────────────────────────────────── */}
      <Route path="/educators">
        {() => <GridPage><AppShell><EducatorPage /></AppShell></GridPage>}
      </Route>
      <Route path="/educators/:slug">
        {() => <Page><AppShell><EducatorDetailPage /></AppShell></Page>}
      </Route>

      {/* ── Zhyrau ─────────────────────────────────────────────────────── */}
      <Route path="/zhyrau">
        {() => <GridPage><AppShell><ZhyrauPage /></AppShell></GridPage>}
      </Route>
      <Route path="/zhyrau/:slug">
        {() => <Page><AppShell><ZhyrauDetailPage /></AppShell></Page>}
      </Route>

      {/* ── Authors ────────────────────────────────────────────────────── */}
      <Route path="/author/:slug">
        {() => <Page><AppShell><AuthorDetailPage /></AppShell></Page>}
      </Route>
      <Route path="/authors/:category/:slug">
        {() => <Page><AppShell><UniversalAuthorPage /></AppShell></Page>}
      </Route>

      {/* ── Works ──────────────────────────────────────────────────────── */}
      <Route path="/works/:slug">
        {() => <Page><AppShell><WorkDetailPage /></AppShell></Page>}
      </Route>

      {/* ── Reader ─────────────────────────────────────────────────────── */}
      <Route path="/reader">
        {() => <GridPage><AppShell><PdfLibraryPage /></AppShell></GridPage>}
      </Route>
      <Route path="/reader/pdf/:slug">
        {() => <ReaderPage><PdfReaderPage /></ReaderPage>}
      </Route>
      <Route path="/reader/:slug">
        {() => <ReaderPage><DigitalReaderPage /></ReaderPage>}
      </Route>
      <Route path="/shygarma/:ownerSlug/:itemId">
        {() => <ReaderPage><WorkPdfReaderPage /></ReaderPage>}
      </Route>

      {/* ── Analysis ───────────────────────────────────────────────────── */}
      <Route path="/analysis">
        {() => <Page><AppShell><FreeAnalysisPage /></AppShell></Page>}
      </Route>
      <Route path="/analysis/:workSlug">
        {() => <Page><AnalysisPage /></Page>}
      </Route>

      {/* ── Interactive ────────────────────────────────────────────────── */}
      <Route path="/interactive">
        {() => <Page><InteractivePage /></Page>}
      </Route>

      {/* ── User modules ───────────────────────────────────────────────── */}
      <Route path="/cabinet">
        {() => <DashPage><StudentCabinetPage /></DashPage>}
      </Route>
      <Route path="/mugalim">
        {() => <DashPage><TeacherDashboardPage /></DashPage>}
      </Route>

      {/* ── 404 ────────────────────────────────────────────────────────── */}
      <Route>
        {() => <AppShell><NotFound /></AppShell>}
      </Route>
    </Switch>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
