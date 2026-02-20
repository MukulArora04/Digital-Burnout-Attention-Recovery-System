import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DistractionWarningProps {
  visible: boolean;
  onDismiss: () => void;
  switchCount: number;
}

/**
 * DistractionWarning component displays a non-intrusive notification
 * when the user switches tabs frequently, encouraging focused work.
 * 
 * Appears in the bottom-right corner and can be dismissed by the user.
 * Uses CSS transitions for smooth entrance/exit animations.
 */
export function DistractionWarning({ visible, onDismiss, switchCount }: DistractionWarningProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      // Delay to trigger CSS transition
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [visible]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for transition to complete before calling onDismiss
    setTimeout(onDismiss, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <Card className="border-amber-500/50 bg-amber-500/5 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">Frequent Tab Switching Detected</h4>
              <p className="text-sm text-muted-foreground mb-2">
                You've switched tabs <strong>{switchCount} times</strong> in the last 2 minutes.
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Try focusing on one task for a few minutes to improve your productivity.
              </p>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                Got it
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
