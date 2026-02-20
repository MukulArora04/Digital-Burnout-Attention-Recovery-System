import { useState, useEffect } from 'react';

export function useBreakAnalytics() {
  const [restorativeTime, setRestorativeTime] = useState(45);
  const [nonRestorativeTime, setNonRestorativeTime] = useState(15);

  const total = restorativeTime + nonRestorativeTime;
  const restorativePercentage = (restorativeTime / total) * 100;
  const nonRestorativePercentage = (nonRestorativeTime / total) * 100;

  return {
    restorativePercentage,
    nonRestorativePercentage,
    restorativeTime,
    nonRestorativeTime,
  };
}
