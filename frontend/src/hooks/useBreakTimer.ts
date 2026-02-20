import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { BreakType } from '../backend';

export function useBreakTimer(breakType: 'deskRecovery' | 'walkBreak', defaultDuration: number) {
  const { actor } = useActor();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);

  const startBreak = () => {
    setStartTime(Date.now());
    setIsRunning(true);
  };

  const endBreak = () => {
    if (startTime && actor) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);

      actor
        .recordBreak({
          startTime: BigInt(startTime * 1_000_000),
          endTime: BigInt(endTime * 1_000_000),
          breakType: breakType === 'deskRecovery' ? BreakType.deskRecovery : BreakType.walkBreak,
          timerSetting: {
            duration: BigInt(defaultDuration),
            notification: true,
          },
          isRestorative: breakType === 'deskRecovery',
        })
        .catch(console.error);
    }

    setStartTime(null);
    setIsRunning(false);
    setTimeRemaining(defaultDuration);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endBreak();
          return defaultDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, defaultDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    startBreak,
    endBreak,
    isRunning,
  };
}
