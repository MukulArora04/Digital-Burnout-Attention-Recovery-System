import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for initialization to complete
    if (isInitializing) return;

    // Check if user is authenticated
    const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

    if (!isAuthenticated) {
      // Redirect to login page
      navigate({ to: '/login' }).catch((error) => {
        console.error('Navigation error:', error);
      });
    }
  }, [identity, isInitializing, navigate]);

  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Check if authenticated
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
