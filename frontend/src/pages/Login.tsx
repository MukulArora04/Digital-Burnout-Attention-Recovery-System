import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Loader2, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const { login, loginStatus, isLoggingIn, isLoginError, loginError, identity } = useInternetIdentity();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (identity && !identity.getPrincipal().isAnonymous()) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and branding */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
            <Activity className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Focus Guardian</h1>
            <p className="text-muted-foreground mt-1">Your productivity coach</p>
          </div>
        </div>

        {/* Login card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in securely to continue tracking your productivity journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error message */}
            {isLoginError && loginError && (
              <Alert variant="destructive">
                <AlertDescription>{loginError.message}</AlertDescription>
              </Alert>
            )}

            {/* Login button */}
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 text-base gap-2"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            {/* Info section */}
            <div className="pt-4 border-t border-border/50">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p>Secure authentication powered by Internet Computer</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p>No passwords to remember or manage</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p>Your data stays private and secure</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}
