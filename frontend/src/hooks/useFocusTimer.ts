import { useState, useEffect } from 'react';

export function useFocusTimer(isActive: boolean) {
  const [focusDuration, setFocusDuration] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setFocusDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setFocusDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    focusDuration,
    formattedTime: formatTime(focusDuration),
  };
}
