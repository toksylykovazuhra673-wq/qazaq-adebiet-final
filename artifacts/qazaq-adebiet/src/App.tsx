import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Pages
import HomePage from '@/pages/HomePage';
import PoetsPage from '@/pages/poets/PoetsPage';
import PoetDetailPage from '@/pages/poets/PoetDetailPage';
import CategoryListPage from '@/pages/CategoryListPage';
import AuthorDetailPage from '@/pages/AuthorDetailPage';
import PlaceholderPage from '@/pages/PlaceholderPage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

// Main App Layout Wrapper to ensure Header and Footer are present on all pages
// unless it's just the HomePage which already imports them.
// Wait, the HomePage already includes Header and Footer.
// For consistency, let's wrap all pages EXCEPT HomePage in a layout, OR we remove Header/Footer from HomePage and put them here.
// The instructions say "HomePage assembles all home sections in order... Footer".
// But we want Header and Footer on other pages too.
// Let's create a Shell component.
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* HomePage defines its own Header/Footer according to instructions, 
          but actually it's better to just render HomePage. */}
      <Route path="/" component={HomePage} />
      
      {/* Other routes wrapped in AppShell */}
      <Route path="/aqyndar">
        {() => <AppShell><CategoryListPage /></AppShell>}
      </Route>
      <Route path="/zhazushylar">
        {() => <AppShell><CategoryListPage /></AppShell>}
      </Route>
      <Route path="/zhyraudar">
        {() => <AppShell><CategoryListPage /></AppShell>}
      </Route>
      <Route path="/kitapkhana">
        {() => <AppShell><CategoryListPage /></AppShell>}
      </Route>
      
      <Route path="/taldau">
        {() => <AppShell><PlaceholderPage /></AppShell>}
      </Route>
      <Route path="/oyyndar">
        {() => <AppShell><PlaceholderPage /></AppShell>}
      </Route>
      <Route path="/olimpiada">
        {() => <AppShell><PlaceholderPage /></AppShell>}
      </Route>
      
      <Route path="/poets">
        {() => <AppShell><PoetsPage /></AppShell>}
      </Route>
      <Route path="/poets/:slug">
        {() => <AppShell><PoetDetailPage /></AppShell>}
      </Route>
      
      <Route path="/author/:slug">
        {() => <AppShell><AuthorDetailPage /></AppShell>}
      </Route>

      <Route>
        {() => <AppShell><NotFound /></AppShell>}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
