import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Reset key — change to force boundary reset */
  resetKey?: string | number;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    // In production you'd send this to Sentry / Datadog here
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null, errorInfo: null });
    }
  }

  reset = () => this.setState({ error: null, errorInfo: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/25
              flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h2 className="text-foreground font-bold text-xl mb-2">
              Қате орын алды
            </h2>
            <p className="text-muted-foreground text-sm mb-1">
              Беттің жүктелуінде мәселе туындады.
            </p>
            {import.meta.env.DEV && (
              <pre className="mt-3 text-left text-xs text-red-400 bg-red-500/5 border
                border-red-500/15 rounded-xl p-4 overflow-auto max-h-40 mb-6">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={this.reset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/15
                  border border-primary/25 text-primary text-sm font-medium
                  hover:bg-primary/25 transition-all">
                <RefreshCw size={14} /> Қайталау
              </button>
              <a href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5
                  border border-white/10 text-muted-foreground text-sm font-medium
                  hover:bg-white/8 transition-all">
                <Home size={14} /> Басты бет
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Convenience wrapper for route-level boundaries */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
