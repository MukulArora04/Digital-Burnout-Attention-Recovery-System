import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Focus Streak',
    description: 'Maintain focus for 7 consecutive days',
    imageUrl: '/assets/generated/badge-focus-streak.dim_256x256.png',
    unlocked: true,
    unlockedDate: 'Feb 15, 2026',
  },
  {
    id: '2',
    title: 'Deep Work Master',
    description: 'Complete 100 hours of deep work',
    imageUrl: '/assets/generated/badge-deep-work.dim_256x256.png',
    unlocked: true,
    unlockedDate: 'Feb 10, 2026',
  },
  {
    id: '3',
    title: 'Distraction Shield',
    description: 'Resist distractions for 30 days',
    imageUrl: '/assets/generated/badge-distraction-shield.dim_256x256.png',
    unlocked: false,
    progress: 67,
  },
  {
    id: '4',
    title: 'Early Bird',
    description: 'Start work before 8 AM for 14 days',
    imageUrl: '/assets/generated/badge-focus-streak.dim_256x256.png',
    unlocked: false,
    progress: 42,
  },
  {
    id: '5',
    title: 'Marathon Runner',
    description: 'Complete a 4-hour focus session',
    imageUrl: '/assets/generated/badge-deep-work.dim_256x256.png',
    unlocked: false,
    progress: 85,
  },
  {
    id: '6',
    title: 'Zen Master',
    description: 'Complete 50 breathing exercises',
    imageUrl: '/assets/generated/badge-distraction-shield.dim_256x256.png',
    unlocked: false,
    progress: 28,
  },
];

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  const shareAchievement = (title: string) => {
    const text = `I just unlocked the "${title}" achievement in Focus Guardian! 🎉`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return {
    achievements,
    shareAchievement,
  };
}
