import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProductivityScoreProps {
  score: number;
}

export function ProductivityScore({ score }: ProductivityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Overall Productivity Score</CardTitle>
        <CardDescription>Your focus quality for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
                className={cn('transition-all duration-1000', getScoreColor(score))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-3xl font-bold', getScoreColor(score))}>{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className={cn('text-2xl font-bold mb-1', getScoreColor(score))}>
                {getScoreLabel(score)}
              </p>
              <p className="text-sm text-muted-foreground">
                {score >= 80
                  ? "You're maintaining excellent focus and minimizing distractions. Keep up the great work!"
                  : score >= 60
                  ? "You're doing well, but there's room to reduce context switching and improve focus duration."
                  : score >= 40
                  ? 'Consider taking more structured breaks and reducing distracting applications.'
                  : 'Your attention is quite fragmented. Try the desk recovery exercise and review your app categories.'}
              </p>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
