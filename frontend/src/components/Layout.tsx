import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Activity, LayoutDashboard, Settings, Award, FileText, Coffee, Wind, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouterState();
  const navigate = useNavigate();
  const currentPath = router.location.pathname;
  const { identity, clear } = useInternetIdentity();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/monitor', label: 'Live Monitor', icon: Activity },
    { path: '/apps', label: 'Apps', icon: Settings },
    { path: '/achievements', label: 'Achievements', icon: Award },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  const quickActions = [
    { path: '/desk-recovery', label: 'Desk Recovery', icon: Coffee },
    { path: '/walk-break', label: 'Walk Break', icon: Wind },
  ];

  const handleLogout = () => {
    clear();
    navigate({ to: '/login' });
  };

  // Get user principal for display
  const userPrincipal = identity?.getPrincipal().toString();
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  // Truncate principal for display
  const displayPrincipal = userPrincipal
    ? `${userPrincipal.slice(0, 8)}...${userPrincipal.slice(-6)}`
    : 'Not logged in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Profile icon in top-left corner */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/assets/generated/profile-icon.dim_64x64.png" alt="Profile" />
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    {isAuthenticated && (
                      <p className="text-xs leading-none text-muted-foreground font-mono">
                        {displayPrincipal}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate({ to: '/login' })} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* App branding */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Focus Guardian</h1>
                <p className="text-xs text-muted-foreground">Your productivity coach</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.path} to={action.path}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="container py-8">{children}</main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Focus Guardian</p>
          <p>
            Built with <span className="text-red-500">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'focus-guardian'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
