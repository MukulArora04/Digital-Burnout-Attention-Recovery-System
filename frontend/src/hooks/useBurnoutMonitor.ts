import { useState, useEffect } from 'react';
import { useActivitySimulator } from './useActivitySimulator';
import { useApplications } from './useApplications';
import { useActor } from './useActor';

/**
 * Burnout monitoring hook that calculates burnout index using the mathematical formula:
 * 
 * BI_new = BI_old + (Δt × Weight_app) + (SwitchCount × σ)
 * 
 * Where:
 * - BI_old: Previous burnout index (0-100 scale)
 * - BI_new: Updated burnout index after calculation
 * - Δt: Time spent in the current application session (in seconds)
 * - Weight_app: Application distraction weight (0.1-0.3 for productive, 0.5-1.0 for distracting)
 * - SwitchCount: Number of application switches in the current period
 * - σ (sigma): Context switching penalty constant (mental cost of switching)
 * 
 * Burnout levels:
 * - Low: < 30 (healthy focus patterns)
 * - Medium: 30-60 (warning threshold, suggests break)
 * - High: > 60 (critical threshold, triggers grayscale overlay)
 */

// Context switching penalty constant (σ)
// Represents the mental cost of switching between applications
// Higher values increase burnout faster when switching frequently
// Suggested range: 2-5 (tuned to 3 for balanced sensitivity)
const SIGMA = 3;

// Default weight for unknown/uncategorized applications
const DEFAULT_WEIGHT = 0.4;

export function useBurnoutMonitor() {
  const [burnoutIndex, setBurnoutIndex] = useState(0);
  const [burnoutLevel, setBurnoutLevel] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastDismissedIndex, setLastDismissedIndex] = useState(0);
  
  // Track intermediate calculation components for breakdown display
  const [timeBasedContribution, setTimeBasedContribution] = useState(0);
  const [switchingContribution, setSwitchingContribution] = useState(0);
  
  // Track session timing for Δt calculation
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [lastApp, setLastApp] = useState<string>('');
  const [totalSwitchCount, setTotalSwitchCount] = useState(0);
  
  // Get current application activity data
  const { currentApp, category, switchCount } = useActivitySimulator();
  
  // Get application categorization data for Weight_app lookup
  const { applications } = useApplications();
  
  // Get backend actor for recording burnout calculations
  const { actor } = useActor();

  /**
   * Get application weight (Weight_app) based on category
   * 
   * Weight mapping:
   * - Productive applications: 0.1-0.3 (low weight, minimal burnout contribution)
   * - Distracting applications: 0.5-1.0 (high weight, significant burnout contribution)
   * - Unknown/uncategorized: 0.4 (medium weight, default fallback)
   * 
   * @param appName - Name of the application to look up
   * @returns Weight value for the application
   */
  const getApplicationWeight = (appName: string): number => {
    try {
      const app = applications.find((a) => a.name === appName);
      
      if (!app) {
        // Unknown application - use default medium weight
        return DEFAULT_WEIGHT;
      }
      
      if (app.category === 'productive') {
        // Productive apps have low weight (0.1-0.3)
        // Using 0.2 as a balanced value for productive work
        return 0.2;
      } else {
        // Distracting apps have high weight (0.5-1.0)
        // Using 0.8 as a significant but not maximum distraction weight
        return 0.8;
      }
    } catch (error) {
      console.error('Error getting application weight:', error);
      return DEFAULT_WEIGHT;
    }
  };

  /**
   * Calculate burnout index using the mathematical formula
   * 
   * This effect triggers when the user switches to a different application.
   * It calculates the time spent (Δt) in the previous application and applies
   * the burnout formula to update the index.
   */
  useEffect(() => {
    try {
      // Detect application switch
      if (currentApp !== lastApp && lastApp !== '') {
        const now = Date.now();
        
        // Calculate Δt: Time spent in the previous application (in seconds)
        const deltaT = Math.max(0, (now - sessionStartTime) / 1000);
        
        // Get Weight_app for the previous application
        const weight = getApplicationWeight(lastApp);
        
        // Increment switch count
        const newSwitchCount = totalSwitchCount + 1;
        setTotalSwitchCount(newSwitchCount);
        
        // Calculate burnout contributions
        // Time-based contribution: Δt × Weight_app
        const timeBased = deltaT * weight;
        
        // Switching-based contribution: SwitchCount × σ
        const switchingBased = newSwitchCount * SIGMA;
        
        // Apply the burnout formula: BI_new = BI_old + (Δt × Weight_app) + (SwitchCount × σ)
        setBurnoutIndex((prevIndex) => {
          const newIndex = prevIndex + timeBased + switchingBased;
          
          // Scale to keep burnout index in 0-100 range
          // Using a logarithmic scaling factor to prevent runaway growth
          const scaledIndex = Math.min(Math.max(0, newIndex * 0.1), 100);
          
          return scaledIndex;
        });
        
        // Store contributions for breakdown display
        setTimeBasedContribution(timeBased);
        setSwitchingContribution(switchingBased);
        
        // Record calculation to backend for historical tracking
        if (actor) {
          actor.recordBurnoutCalculation({
            timestamp: BigInt(now * 1_000_000), // Convert to nanoseconds
            previousIndex: BigInt(Math.floor(burnoutIndex)),
            currentIndex: BigInt(Math.floor(burnoutIndex + timeBased + switchingBased)),
            focusSessionTimestamps: [], // Placeholder for future enhancement
            switchCount: BigInt(newSwitchCount),
            breakAnalysis: {
              totalBreaks: BigInt(0),
              deskRecoveries: BigInt(0),
              walkBreaks: BigInt(0),
              restorativeRatio: 0,
            },
            sleepAnalysis: {
              totalSleepHours: 0,
              deepRestHours: 0,
              sleepDeficitScore: 0,
            },
            notificationAnalysis: {
              frequency: BigInt(0),
              responseTimeAverage: 0,
            },
          }).catch((error) => {
            console.error('Failed to record burnout calculation:', error);
          });
        }
      }
      
      // Update tracking state for next switch
      if (currentApp !== lastApp) {
        setLastApp(currentApp);
        setSessionStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error in burnout calculation:', error);
    }
  }, [currentApp, lastApp, sessionStartTime, totalSwitchCount, applications, burnoutIndex, actor]);

  /**
   * Decrease burnout index during productive focus periods
   * 
   * Recovery logic:
   * - When user stays in a productive application without switching
   * - Burnout decreases by 0.5 points every 30 seconds
   * - Simulates mental recovery during sustained focus
   */
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const weight = getApplicationWeight(currentApp);
        
        // Only decrease burnout if in a productive app (low weight)
        if (weight < 0.3 && burnoutIndex > 0) {
          setBurnoutIndex((prev) => Math.max(prev - 0.5, 0));
        }
      } catch (error) {
        console.error('Error in burnout recovery:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentApp, burnoutIndex, applications]);

  /**
   * Persist burnout index to localStorage
   * Restore on mount to maintain state across sessions
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('burnoutIndex');
      if (stored) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed)) {
          setBurnoutIndex(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading burnout index from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (!isNaN(burnoutIndex)) {
        localStorage.setItem('burnoutIndex', burnoutIndex.toString());
      }
    } catch (error) {
      console.error('Error saving burnout index to localStorage:', error);
    }
  }, [burnoutIndex]);

  /**
   * Categorize burnout level based on index
   * 
   * Level 0: < 30 (no warning)
   * Level 1: 30-60 (medium, show warning)
   * Level 2: > 60 (high, show grayscale overlay)
   */
  useEffect(() => {
    try {
      if (burnoutIndex >= 60) {
        setBurnoutLevel(2);
      } else if (burnoutIndex >= 30) {
        setBurnoutLevel(1);
      } else {
        setBurnoutLevel(0);
        setIsDismissed(false);
      }
    } catch (error) {
      console.error('Error updating burnout level:', error);
    }
  }, [burnoutIndex]);

  /**
   * Handle warning dismissal
   * Warning reappears if burnout increases by 10+ points after dismissal
   */
  const dismissWarning = () => {
    try {
      setIsDismissed(true);
      setLastDismissedIndex(burnoutIndex);
    } catch (error) {
      console.error('Error dismissing warning:', error);
    }
  };

  // Show warning again if burnout increased significantly after dismissal
  useEffect(() => {
    try {
      if (isDismissed && burnoutIndex > lastDismissedIndex + 10) {
        setIsDismissed(false);
      }
    } catch (error) {
      console.error('Error checking dismissal state:', error);
    }
  }, [burnoutIndex, isDismissed, lastDismissedIndex]);

  return {
    burnoutIndex,
    burnoutLevel: isDismissed && burnoutLevel === 1 ? 0 : burnoutLevel,
    dismissWarning,
    timeBasedContribution,
    switchingContribution,
  };
}
