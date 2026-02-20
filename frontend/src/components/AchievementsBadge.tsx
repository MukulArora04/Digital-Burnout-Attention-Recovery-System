import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AchievementsBadgeProps {
  title: string;
  description: string;
  imageUrl: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
}

export function AchievementsBadge({
  title,
  description,
  imageUrl,
  unlocked,
  unlockedDate,
  progress,
}: AchievementsBadgeProps) {
  return (
    <Card className={cn('transition-all', unlocked ? 'border-primary/50' : 'opacity-60')}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={cn(
              'relative h-24 w-24 rounded-full p-2',
              unlocked ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <img
              src={imageUrl}
              alt={title}
              className={cn('h-full w-full object-contain', !unlocked && 'grayscale')}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>

            {unlocked && unlockedDate && (
              <Badge variant="secondary" className="mt-2">
                Unlocked {unlockedDate}
              </Badge>
            )}

            {!unlocked && progress !== undefined && (
              <div className="mt-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
