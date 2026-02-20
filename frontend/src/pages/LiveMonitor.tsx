import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useActivitySimulator } from '@/hooks/useActivitySimulator';
import { useActivityData } from '@/hooks/useQueries';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { useFocusMonitor } from '@/hooks/useFocusMonitor';
import { ValidationMetrics } from '@/components/ValidationMetrics';
import { Activity, Clock, Zap, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function LiveMonitor() {
  const { currentApp, category, isActive } = useActivitySimulator();
  const { focusDuration, formattedTime } = useFocusTimer(isActive);
  
  // Get real-time focus monitoring data
  const focusMonitor = useFocusMonitor();
  
  // Fetch real-time activity data from backend
  const { data: activityData, isLoading } = useActivityData();

  // Calculate real-time metrics from backend data with fallback
  const metrics = useMemo(() => {
    try {
      if (!activityData || activityData.length === 0) {
        // Return mock data when no backend data is available
        return {
          switchCount: 3,
          switchesPerMinute: 0.5,
          switchesPerHour: 8,
        };
      }

      // Get recent scores (last 5 minutes)
      const recentScores = activityData.slice(-5);
      
      // Calculate total switches
      const totalSwitches = recentScores.reduce((sum, score) => sum + Number(score.tabSwitchCount), 0);
      
      // Calculate switches per minute (average from recent data)
      const switchesPerMinute = recentScores.length > 0 ? totalSwitches / (recentScores.length * 0.167) : 0;
      
      // Estimate switches per hour
      const switchesPerHour = switchesPerMinute * 60;

      return {
        switchCount: totalSwitches,
        switchesPerMinute: Math.round(switchesPerMinute * 10) / 10,
        switchesPerHour: Math.round(switchesPerHour),
      };
    } catch (error) {
      console.error('Error calculating activity metrics:', error);
      // Return fallback mock data on any error
      return {
        switchCount: 3,
        switchesPerMinute: 0.5,
        switchesPerHour: 8,
      };
    }
  }, [activityData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Live Activity Monitor</h2>
        <p className="text-muted-foreground">
          Real-time tracking of your focus and attention patterns
        </p>
      </div>

      {/* Current Activity */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Current Application</CardTitle>
                <CardDescription>What you're working on right now</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-3 w-3 rounded-full",
                isActive ? "bg-green-500 animate-pulse" : "bg-muted"
              )} />
              <span className="text-sm text-muted-foreground">
                {isActive ? 'Active' : 'Idle'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold mb-1">{currentApp}</p>
              <Badge variant={category === 'productive' ? 'default' : 'destructive'}>
                {category}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Focus Duration</p>
              <p className="text-3xl font-bold text-primary">{formattedTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Total Switches</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics.switchCount}</p>
              <p className="text-sm text-muted-foreground mt-1">In recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Per Minute</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics.switchesPerMinute}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {metrics.switchesPerMinute < 1 ? 'Excellent focus' : 'Moderate switching'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Per Hour</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics.switchesPerHour}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {metrics.switchesPerHour < 10 ? 'Great concentration' : 'High activity'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Focus Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Tips</CardTitle>
          <CardDescription>Strategies to maintain your concentration</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Use the Pomodoro Technique</p>
                <p className="text-sm text-muted-foreground">
                  Work in 25-minute focused sessions with 5-minute breaks
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Minimize Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Turn off non-essential notifications during deep work sessions
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Single-Task Focus</p>
                <p className="text-sm text-muted-foreground">
                  Close unnecessary tabs and applications to reduce temptation
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Separator before validation metrics */}
      <Separator className="my-8" />

      {/* Validation Metrics Section */}
      <ValidationMetrics
        switchingHistory={focusMonitor.switchingHistory}
        currentDistractionScore={focusMonitor.distractionScore}
        totalSwitches={focusMonitor.switchCount}
        switchesPerMinute={focusMonitor.switchesPerMinute}
        switchesPerHour={focusMonitor.switchesPerHour}
      />
    </div>
  );
}
