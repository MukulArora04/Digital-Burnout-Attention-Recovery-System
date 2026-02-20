import { useState, useEffect } from 'react';

interface Pattern {
  title: string;
  description: string;
  trend: string;
}

export function useReportData(timePeriod: 'week' | 'month') {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }, [timePeriod]);

  const positivePatterns: Pattern[] = [
    {
      title: 'Consistent Work Sessions',
      description:
        'You maintained regular work blocks throughout the week, with an average session length of 90 minutes.',
      trend: '+15% compared to last week',
    },
    {
      title: 'Healthy Break Timing',
      description:
        'Your breaks are well-distributed and mostly restorative, helping maintain sustained focus.',
      trend: '85% restorative breaks',
    },
    {
      title: 'Reduced Distractions',
      description:
        'Time spent on distracting applications decreased significantly, showing improved discipline.',
      trend: '-22% distraction time',
    },
  ];

  const negativePatterns: Pattern[] = [
    {
      title: 'Frequent Context Switching',
      description:
        'Your switching frequency peaks between 2-4 PM, indicating potential afternoon fatigue.',
      trend: 'Average 18 switches/hour during peak',
    },
    {
      title: 'Late-Night Work Sessions',
      description:
        'Working past 10 PM shows elevated burnout indices and reduced productivity.',
      trend: '3 late sessions this week',
    },
  ];

  return {
    positivePatterns,
    negativePatterns,
    isLoading,
  };
}
