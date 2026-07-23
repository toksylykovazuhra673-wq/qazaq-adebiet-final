import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { Shell } from '@/components/layout/Shell';

// Pages
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import LessonViewer from '@/pages/LessonViewer';
import Vocabulary from '@/pages/Vocabulary';
import Grammar from '@/pages/Grammar';
import Leaderboard from '@/pages/Leaderboard';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:courseId" component={CourseDetail} />
      <Route path="/vocabulary" component={Vocabulary} />
      <Route path="/grammar" component={Grammar} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Switch>
              <Route path="/lessons/:lessonId" component={LessonViewer} />
              <Route path="*">
                <Shell>
                  <Router />
                </Shell>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
