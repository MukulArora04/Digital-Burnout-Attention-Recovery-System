import { useState, useEffect } from 'react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function useBreathingAnimation(isActive: boolean) {
  const [phase, setPhase] = useState<Phase>('rest');
  const [scale, setScale] = useState(150);

  useEffect(() => {
    if (!isActive) {
      setPhase('rest');
      setScale(150);
      return;
    }

    const cycle = async () => {
      setPhase('inhale');
      setScale(250);
      await new Promise((resolve) => setTimeout(resolve, 4000));

      setPhase('hold');
      await new Promise((resolve) => setTimeout(resolve, 4000));

      setPhase('exhale');
      setScale(150);
      await new Promise((resolve) => setTimeout(resolve, 6000));

      setPhase('rest');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const interval = setInterval(cycle, 16000);
    cycle();

    return () => clearInterval(interval);
  }, [isActive]);

  return { phase, scale };
}
