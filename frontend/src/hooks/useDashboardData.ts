import { useMemo } from 'react';
import { useGetFocusScores, useGetAllReports } from './useQueries';

export function useDashboardData() {
  const { data: focusScores, isLoading: isLoadingScores } = useGetFocusScores();
  const { data: reports, isLoading: isLoadingReports } = useGetAllReports();

  const isLoading = isLoadingScores || isLoadingReports;

  // Calculate metrics from actual backend data with fallback to mock data
  const metrics = useMemo(() => {
    try {
      if (!focusScores || focusScores.length === 0) {
        // Return mock data when no backend data is available
        return {
          focusTime: '2h 15m',
          distractionTime: '25m',
          switchingFrequency: 5,
          productivityScore: 78,
          burnoutTrend: [
            { day: 'Mon', burnout: 3.2 },
            { day: 'Tue', burnout: 4.1 },
            { day: 'Wed', burnout: 3.8 },
            { day: 'Thu', burnout: 5.2 },
            { day: 'Fri', burnout: 4.5 },
            { day: 'Sat', burnout: 2.8 },
            { day: 'Sun', burnout: 3.1 },
          ],
          recommendations: [
            'Your focus patterns are looking good! Keep up the great work.',
            'Consider taking regular breaks to maintain your productivity.',
            'Try scheduling focused work blocks for optimal concentration.',
          ],
        };
      }

      // Calculate total distraction time from timeAway values
      const totalTimeAway = focusScores.reduce((sum, score) => sum + Number(score.timeAway), 0);
      const distractionHours = Math.floor(totalTimeAway / 3600);
      const distractionMinutes = Math.floor((totalTimeAway % 3600) / 60);

      // Estimate focus time (assuming 8-hour workday minus distraction time)
      const estimatedWorkSeconds = 8 * 3600;
      const focusSeconds = Math.max(0, estimatedWorkSeconds - totalTimeAway);
      const focusHours = Math.floor(focusSeconds / 3600);
      const focusMinutes = Math.floor((focusSeconds % 3600) / 60);

      // Calculate average switching frequency
      const totalSwitches = focusScores.reduce((sum, score) => sum + Number(score.tabSwitchCount), 0);
      const avgSwitchingFrequency = focusScores.length > 0 ? Math.round(totalSwitches / focusScores.length) : 0;

      // Calculate productivity score (0-100) based on distraction score and switching frequency
      const avgDistractionScore = focusScores.reduce((sum, score) => sum + Number(score.distractionScore), 0) / focusScores.length;
      const productivityScore = Math.max(0, Math.min(100, 100 - (avgDistractionScore * 5) - (avgSwitchingFrequency * 2)));

      // Generate burnout trend from last 7 data points
      const recentScores = focusScores.slice(-7);
      const burnoutTrend = recentScores.map((score, index) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index % 7],
        burnout: Number(score.distractionScore) / 2, // Normalize to 0-10 scale
      }));

      // Generate recommendations based on patterns
      const recommendations: string[] = [];
      
      if (avgSwitchingFrequency > 10) {
        recommendations.push('Your switching frequency is high. Try scheduling focused work blocks without interruptions.');
      } else if (avgSwitchingFrequency < 5) {
        recommendations.push('Excellent focus! Your low switching frequency shows great concentration.');
      }

      if (avgDistractionScore > 5) {
        recommendations.push('Consider taking more desk recovery breaks to reduce cognitive fatigue.');
      }

      if (totalTimeAway > 3600) {
        recommendations.push('You spent significant time away. Try the Pomodoro technique: 25 minutes focus, 5 minutes break.');
      }

      if (recommendations.length === 0) {
        recommendations.push('Keep up the great work! Your focus patterns are healthy.');
      }

      // Add pattern-based recommendations from reports
      if (reports && reports.length > 0) {
        const latestReport = reports[reports.length - 1];
        latestReport.patterns.forEach((pattern) => {
          if (pattern.__kind__ === 'positive') {
            if (pattern.positive === 'workConsistency') {
              recommendations.push('Your work consistency is excellent. Maintain this rhythm for optimal productivity.');
            }
          }
        });
      }

      return {
        focusTime: `${focusHours}h ${focusMinutes}m`,
        distractionTime: `${distractionHours}h ${distractionMinutes}m`,
        switchingFrequency: avgSwitchingFrequency,
        productivityScore: Math.round(productivityScore),
        burnoutTrend: burnoutTrend.length > 0 ? burnoutTrend : [
          { day: 'Mon', burnout: 3.2 },
          { day: 'Tue', burnout: 4.1 },
          { day: 'Wed', burnout: 3.8 },
          { day: 'Thu', burnout: 5.2 },
          { day: 'Fri', burnout: 4.5 },
          { day: 'Sat', burnout: 2.8 },
          { day: 'Sun', burnout: 3.1 },
        ],
        recommendations,
      };
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error);
      // Return fallback mock data on any error
      return {
        focusTime: '2h 15m',
        distractionTime: '25m',
        switchingFrequency: 5,
        productivityScore: 78,
        burnoutTrend: [
          { day: 'Mon', burnout: 3.2 },
          { day: 'Tue', burnout: 4.1 },
          { day: 'Wed', burnout: 3.8 },
          { day: 'Thu', burnout: 5.2 },
          { day: 'Fri', burnout: 4.5 },
          { day: 'Sat', burnout: 2.8 },
          { day: 'Sun', burnout: 3.1 },
        ],
        recommendations: [
          'Your focus patterns are looking good! Keep up the great work.',
          'Consider taking regular breaks to maintain your productivity.',
          'Try scheduling focused work blocks for optimal concentration.',
        ],
      };
    }
  }, [focusScores, reports]);

  return {
    ...metrics,
    isLoading,
  };
}
