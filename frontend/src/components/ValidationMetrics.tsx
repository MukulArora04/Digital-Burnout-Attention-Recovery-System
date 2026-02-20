import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

interface SwitchEvent {
  timestamp: string;
  awayDuration: number;
  distractionScore: number;
}

interface ValidationMetricsProps {
  switchingHistory: SwitchEvent[];
  currentDistractionScore: number;
  totalSwitches: number;
  switchesPerMinute: number;
  switchesPerHour: number;
}

export function ValidationMetrics({
  switchingHistory,
  currentDistractionScore,
  totalSwitches,
  switchesPerMinute,
  switchesPerHour,
}: ValidationMetricsProps) {
  // Calculate distraction score breakdown
  const scoreBreakdown = useMemo(() => {
    const baseScore = 0;
    const switchMultiplier = 0.5;
    const calculatedScore = Math.floor(totalSwitches * switchMultiplier);
    
    return {
      base: baseScore,
      switchContribution: calculatedScore,
      multiplier: switchMultiplier,
      formula: `Score = ${baseScore} + (${totalSwitches} switches × ${switchMultiplier})`,
    };
  }, [totalSwitches]);

  // Format duration in seconds with 2 decimal places
  const formatDuration = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  // Format timestamp to show milliseconds
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-2">Validation Metrics</h3>
        <p className="text-muted-foreground">
          Detailed real-time switching data for system accuracy verification
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Total Switches</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSwitches}</p>
            <p className="text-xs text-muted-foreground mt-1">Since session start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Per Minute</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{switchesPerMinute.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Current frequency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Per Hour</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{switchesPerHour.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">Projected rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Distraction Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentDistractionScore}</p>
            <p className="text-xs text-muted-foreground mt-1">Current level</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Calculation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Calculation Breakdown</CardTitle>
          <CardDescription>How the distraction score is computed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base Score:</span>
              <span className="font-mono font-semibold">{scoreBreakdown.base}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Switch Contribution:</span>
              <span className="font-mono font-semibold">
                {totalSwitches} × {scoreBreakdown.multiplier} = {scoreBreakdown.switchContribution}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Formula:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{scoreBreakdown.formula}</code>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Score:</span>
              <Badge variant={currentDistractionScore > 5 ? 'destructive' : 'default'}>
                {currentDistractionScore}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Switching History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Switch Events</CardTitle>
          <CardDescription>Last 20 tab switches with millisecond precision</CardDescription>
        </CardHeader>
        <CardContent>
          {switchingHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No switch events recorded yet</p>
              <p className="text-sm mt-1">Switch tabs to see real-time data appear here</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Timestamp (HH:MM:SS.mmm)</TableHead>
                    <TableHead className="text-right">Away Duration (s)</TableHead>
                    <TableHead className="text-right">Score at Switch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {switchingHistory.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-muted-foreground">
                        {switchingHistory.length - index}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(event.timestamp)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatDuration(event.awayDuration)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={event.distractionScore > 5 ? 'destructive' : 'secondary'}>
                          {event.distractionScore}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
