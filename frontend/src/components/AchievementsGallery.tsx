import { Button } from '@/components/ui/button';
import { AchievementsBadge } from './AchievementsBadge';
import { useAchievements } from '@/hooks/useAchievements';
import { Share2, Download } from 'lucide-react';
import { toast } from 'sonner';

export function AchievementsGallery() {
  const { achievements, shareAchievement } = useAchievements();

  const handleShare = (title: string) => {
    shareAchievement(title);
    toast.success('Achievement copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="relative">
            <AchievementsBadge
              title={achievement.title}
              description={achievement.description}
              imageUrl={achievement.imageUrl}
              unlocked={achievement.unlocked}
              unlockedDate={achievement.unlockedDate}
              progress={achievement.progress}
            />
            {achievement.unlocked && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 gap-2"
                onClick={() => handleShare(achievement.title)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
