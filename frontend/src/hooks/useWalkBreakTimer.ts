import { useState, useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { BreakType } from '../backend';

export function useWalkBreakTimer() {
  const { actor } = useActor();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/alert-sound.mp3');
  }, []);

  const startTimer = (durationInSeconds: number) => {
    setStartTime(Date.now());
    setDuration(durationInSeconds);
    setTimeRemaining(durationInSeconds);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (startTime && actor) {
      const endTime = Date.now();
      actor
        .recordBreak({
          startTime: BigInt(startTime * 1_000_000),
          endTime: BigInt(endTime * 1_000_000),
          breakType: BreakType.walkBreak,
          timerSetting: {
            duration: BigInt(duration),
            notification: true,
          },
          isRestorative: true,
        })
        .catch(console.error);
    }

    setStartTime(null);
    setIsRunning(false);
    setTimeRemaining(0);
    setDuration(0);
  };

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    progress,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
