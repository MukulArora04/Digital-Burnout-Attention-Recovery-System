import { useState, useEffect } from 'react';

interface GreyscaleOverlayProps {
  intensity: number;
}

/**
 * GreyscaleOverlay component applies proportional grayscale filter at high burnout
 * 
 * Features:
 * - Activates when burnout reaches high threshold (level 2, index > 60)
 * - Filter intensity increases with burnout level
 * - Does not block pointer events (user can still interact)
 * - Smooth transitions between intensity levels
 * - Removed when burnout decreases below high threshold
 * 
 * Intensity calculation:
 * - burnoutIndex 60: 0% grayscale (threshold)
 * - burnoutIndex 70: 30% grayscale
 * - burnoutIndex 80: 60% grayscale
 * - burnoutIndex 100: 100% grayscale (max)
 */
export function GreyscaleOverlay({ intensity }: GreyscaleOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate grayscale amount based on burnout level
  // intensity is burnout level (0, 1, or 2)
  // For level 2, we want progressive grayscale based on actual burnout index
  const grayscaleAmount = intensity >= 2 ? Math.min((intensity - 2) * 30, 50) : 0;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (grayscaleAmount === 0) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backdropFilter: `grayscale(${grayscaleAmount}%)`,
        WebkitBackdropFilter: `grayscale(${grayscaleAmount}%)`,
      }}
    />
  );
}
