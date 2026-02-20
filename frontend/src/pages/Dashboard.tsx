import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricsCard } from '@/components/MetricsCard';
import { ProductivityScore } from '@/components/ProductivityScore';
import { DailyRecommendations } from '@/components/DailyRecommendations';
import { RecoveryQualityChart } from '@/components/RecoveryQualityChart';
import { DistractionWarning } from '@/components/DistractionWarning';
import { BurnoutBreakdownChart } from '@/components/BurnoutBreakdownChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useFocusMonitor } from '@/hooks/useFocusMonitor';
import { useBurnoutMonitor } from '@/hooks/useBurnoutMonitor';
import { Clock, Zap, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const {
    focusTime,
    distractionTime,
    switchingFrequency,
    burnoutTrend,
    productivityScore,
    recommendations,
    isLoading,
  } = useDashboardData();

  // Monitor focus and tab switching behavior
  const { distractionScore, switchCount, switchesPerMinute } = useFocusMonitor();

  // Get burnout metrics with formula breakdown
  const { 
    burnoutIndex, 
    timeBasedContribution, 
    switchingContribution 
  } = useBurnoutMonitor();

  // Track whether to show the distraction warning
  const [showWarning, setShowWarning] = useState(false);
  const [warningCooldown, setWarningCooldown] = useState(false);

  /**
   * Show warning when distraction score exceeds threshold (3)
   * and we're not in cooldown period
   */
  useEffect(() => {
    if (distractionScore >= 3 && !warningCooldown && !showWarning) {
      setShowWarning(true);
    }
  }, [distractionScore, warningCooldown, showWarning]);

  /**
   * Handle warning dismissal with cooldown period
   * Prevents warning from appearing too frequently
   */
  const handleDismissWarning = () => {
    setShowWarning(false);
    setWarningCooldown(true);
    
    // Reset cooldown after 5 minutes
    setTimeout(() => {
      setWarningCooldown(false);
    }, 5 * 60 * 1000);
  };

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h2>
          <p className="text-lg text-muted-foreground">
            Let's review your focus journey and celebrate your progress.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <img
            src="/assets/generated/dashboard-hero.dim_800x400.png"
            alt="Focus"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Productivity Score */}
      <ProductivityScore score={productivityScore} />

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Focus Time"
          value={focusTime}
          icon={Clock}
          trend="+12%"
          trendUp={true}
        />
        <MetricsCard
          title="Distraction Time"
          value={distractionTime}
          icon={Activity}
          trend="-8%"
          trendUp={true}
        />
        <MetricsCard
          title="Switching Frequency"
          value={`${switchingFrequency}/hr`}
          icon={Zap}
          trend="-15%"
          trendUp={true}
        />
        <MetricsCard
          title="Real-time Switches"
          value={`${switchCount}`}
          icon={TrendingUp}
          trend={switchesPerMinute < 2 ? 'Good focus' : 'High switching'}
          trendUp={switchesPerMinute < 2}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Burnout Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Burnout Trend</CardTitle>
            <CardDescription>Track your cognitive load patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burnoutTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="burnout"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Burnout Breakdown Chart */}
        <BurnoutBreakdownChart
          timeBasedContribution={timeBasedContribution}
          switchingContribution={switchingContribution}
          totalBurnoutIndex={burnoutIndex}
        />
      </div>

      {/* Recovery Quality */}
      <RecoveryQualityChart />

      {/* Daily Recommendations */}
      <DailyRecommendations recommendations={recommendations} />

      {/* Distraction Warning (conditionally rendered) */}
      {showWarning && (
        <DistractionWarning
          visible={showWarning}
          switchCount={switchCount}
          onDismiss={handleDismissWarning}
        />
      )}
    </div>
  );
}
