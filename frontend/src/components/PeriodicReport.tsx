import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PatternCard } from './PatternCard';
import { useReportData } from '@/hooks/useReportData';
import { Download, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PeriodicReport() {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');
  const { positivePatterns, negativePatterns, isLoading } = useReportData(timePeriod);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Select
                value={timePeriod}
                onValueChange={(value: 'week' | 'month') => setTimePeriod(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Positive Patterns */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400">✓</span>
          Positive Patterns
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {positivePatterns.map((pattern, index) => (
            <PatternCard key={index} {...pattern} type="positive" />
          ))}
        </div>
      </div>

      {/* Negative Patterns */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-amber-600 dark:text-amber-400">⚠</span>
          Areas for Improvement
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {negativePatterns.map((pattern, index) => (
            <PatternCard key={index} {...pattern} type="negative" />
          ))}
        </div>
      </div>
    </div>
  );
}
