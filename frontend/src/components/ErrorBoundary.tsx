import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    console.log('ErrorBoundary initialized');
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('ErrorBoundary.getDerivedStateFromError called:', error);
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('=== ErrorBoundary caught an error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('=====================================');
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    console.log('ErrorBoundary: Resetting error state and reloading');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Reload the page to reset the application state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      console.log('ErrorBoundary: Rendering error UI');
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-destructive/50 shadow-xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Something went wrong</CardTitle>
                  <CardDescription>
                    The application encountered an unexpected error
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error message */}
              <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                <p className="text-sm font-medium text-destructive mb-2">Error Details:</p>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              {/* Error stack (collapsed by default) */}
              {this.state.errorInfo && (
                <details className="rounded-lg bg-muted/50 border border-border p-4">
                  <summary className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                    View technical details
                  </summary>
                  <pre className="mt-3 text-xs text-muted-foreground overflow-auto max-h-64 font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Application
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Go to Home
                </Button>
              </div>

              {/* Help text */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  If this problem persists, please try clearing your browser cache and cookies, 
                  or contact support with the error details above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    console.log('ErrorBoundary: No error, rendering children');
    return this.props.children;
  }
}

export default ErrorBoundary;
