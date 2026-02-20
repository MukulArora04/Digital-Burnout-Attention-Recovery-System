import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { useApplications } from './useApplications';
import { AppCategory } from '../backend';

const STORAGE_KEY = 'focus-guardian-activity-state';

interface ActivityState {
  currentApp: string;
  category: 'productive' | 'distracting';
  switchHistory: Array<{ app: string; timestamp: number }>;
  sessionStartTime: number;
}

export function useActivitySimulator() {
  const { actor } = useActor();
  const { applications } = useApplications();
  
  // Initialize state from localStorage if available
  const [currentApp, setCurrentApp] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: ActivityState = JSON.parse(stored);
        return state.currentApp;
      }
    } catch (error) {
      console.error('Failed to restore activity state:', error);
    }
    return 'Visual Studio Code';
  });
  
  const [category, setCategory] = useState<'productive' | 'distracting'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: ActivityState = JSON.parse(stored);
        return state.category;
      }
    } catch (error) {
      console.error('Failed to restore activity state:', error);
    }
    return 'productive';
  });
  
  const [switchHistory, setSwitchHistory] = useState<Array<{ app: string; timestamp: number }>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: ActivityState = JSON.parse(stored);
        return state.switchHistory || [];
      }
    } catch (error) {
      console.error('Failed to restore activity state:', error);
    }
    return [];
  });
  
  // Track session start time for Δt calculation
  const [sessionStartTime, setSessionStartTime] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: ActivityState = JSON.parse(stored);
        return state.sessionStartTime || Date.now();
      }
    } catch (error) {
      console.error('Failed to restore activity state:', error);
    }
    return Date.now();
  });
  
  const [switchCount, setSwitchCount] = useState(0);
  const [switchesPerMinute, setSwitchesPerMinute] = useState(0);
  const [switchesPerHour, setSwitchesPerHour] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [lastSwitchTime, setLastSwitchTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      const state: ActivityState = {
        currentApp,
        category,
        switchHistory,
        sessionStartTime,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save activity state:', error);
    }
  }, [currentApp, category, switchHistory, sessionStartTime]);

  /**
   * Calculate session duration (Δt) in real-time
   * Updates every second to provide accurate time tracking
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const duration = (now - sessionStartTime) / 1000; // Convert to seconds
      setSessionDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  /**
   * Simulate application switching
   * When switching occurs, reset session start time for next Δt calculation
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && applications.length > 0) {
        const randomApp = applications[Math.floor(Math.random() * applications.length)];
        const previousApp = currentApp;

        setCurrentApp(randomApp.name);
        setCategory(randomApp.category);
        setSwitchCount((prev) => prev + 1);
        
        const now = Date.now();
        setSwitchHistory((prev) => [...prev, { app: randomApp.name, timestamp: now }]);
        
        // Reset session start time for new application session
        setSessionStartTime(now);

        const timeSinceLastSwitch = (now - lastSwitchTime) / 1000;
        setLastSwitchTime(now);

        if (actor) {
          actor
            .recordSwitch({
              timestamp: BigInt(now * 1_000_000),
              sourceApp: previousApp,
              targetApp: randomApp.name,
            })
            .catch(console.error);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [actor, applications, currentApp, lastSwitchTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeWindow = 60000;
      setSwitchesPerMinute(switchCount / ((now - lastSwitchTime + timeWindow) / timeWindow));
      setSwitchesPerHour(switchCount * 7.5);
    }, 5000);

    return () => clearInterval(interval);
  }, [switchCount, lastSwitchTime]);

  return {
    currentApp,
    category,
    switchCount,
    switchesPerMinute,
    switchesPerHour,
    isActive,
    sessionDuration, // Export session duration for burnout calculation
  };
}
