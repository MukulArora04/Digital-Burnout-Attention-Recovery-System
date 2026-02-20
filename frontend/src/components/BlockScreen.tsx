import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { COPY } from '@/lib/copyConstants';

interface BlockScreenProps {
  timeRemaining: number;
  onComplete: () => void;
}

/**
 * BlockScreen component displays full-screen blocking interface
 * 
 * Features:
 * - Covers entire viewport (cannot be dismissed)
 * - Timer displays minutes and seconds remaining
 * - Progress bar fills from 0% to 100% over 25 minutes
 * - Productivity tips rotate every 30 seconds
 * - Automatically closes when productive session completes
 * - Timer only decrements when user maintains focus (low switching)
 */
export function BlockScreen({ timeRemaining, onComplete }: BlockScreenProps) {
  const totalTime = 25 * 60; // 25 minutes in seconds
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  // Rotate through productivity tips every 30 seconds
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % COPY.blocking.tips.length);
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="max-w-lg w-full mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{COPY.blocking.title}</CardTitle>
          <CardDescription>
            {COPY.blocking.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-4xl font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">remaining</p>
          </div>

          <Progress value={progress} className="h-3" />

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-center">
              This gentle intervention helps you rebuild focus momentum. Use this time to work on
              productive tasks.
            </p>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium text-foreground mb-2">Tip #{currentTipIndex + 1}:</p>
              <p className="text-base">{COPY.blocking.tips[currentTipIndex]}</p>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Timer advances only when you maintain focus (low tab switching)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
