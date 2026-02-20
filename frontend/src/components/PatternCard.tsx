import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatternCardProps {
  title: string;
  description: string;
  trend: string;
  type: 'positive' | 'negative';
}

export function PatternCard({ title, description, trend, type }: PatternCardProps) {
  const isPositive = type === 'positive';

  return (
    <Card className={cn(isPositive ? 'border-green-500/30' : 'border-amber-500/30')}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full mt-0.5',
              isPositive ? 'bg-green-500/10' : 'bg-amber-500/10'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            <p
              className={cn(
                'text-sm font-medium',
                isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}
            >
              {trend}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
