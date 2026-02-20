import { AchievementsGallery } from '@/components/AchievementsGallery';

export default function Achievements() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Achievements</h2>
        <p className="text-muted-foreground">
          Celebrate your focus milestones and productivity wins
        </p>
      </div>

      <AchievementsGallery />
    </div>
  );
}
