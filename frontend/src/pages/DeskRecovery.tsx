import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBreathingAnimation } from '@/hooks/useBreathingAnimation';
import { useBreakTimer } from '@/hooks/useBreakTimer';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeskRecovery() {
  const [isActive, setIsActive] = useState(false);
  const { phase, scale } = useBreathingAnimation(isActive);
  const { timeRemaining, formattedTime, startBreak, endBreak, isRunning } = useBreakTimer(
    'deskRecovery',
    300
  );

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      endBreak();
    } else {
      setIsActive(true);
      startBreak();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    endBreak();
  };

  const phaseText = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Desk Recovery</h2>
        <p className="text-muted-foreground">
          Take a mindful break with guided breathing exercises
        </p>
      </div>

      {/* Breathing Exercise */}
      <Card className="overflow-hidden">
        <div
          className="relative h-[500px] flex items-center justify-center"
          style={{
            backgroundImage: 'url(/assets/generated/breathing-background.dim_1200x800.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Breathing Circle */}
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  'rounded-full bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm transition-all duration-1000 ease-in-out flex items-center justify-center',
                  isActive && 'shadow-2xl shadow-primary/20'
                )}
                style={{
                  width: `${scale}px`,
                  height: `${scale}px`,
                }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold mb-2">{phaseText[phase]}</p>
                  <p className="text-4xl font-bold">{formattedTime}</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleToggle}
                className="gap-2 min-w-32"
              >
                {isActive ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 1: Breathe In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Slowly inhale through your nose for 4 seconds. Feel your lungs expand and your chest
              rise.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 2: Hold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hold your breath gently for 4 seconds. Stay relaxed and centered.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 3: Breathe Out</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Exhale slowly through your mouth for 6 seconds. Release all tension and stress.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Desk Recovery</CardTitle>
          <CardDescription>Why taking mindful breaks matters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
              <span className="text-sm">✓</span>
            </div>
            <div>
              <p className="font-medium">Reduces Mental Fatigue</p>
              <p className="text-sm text-muted-foreground">
                Short breathing exercises help reset your cognitive resources
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
              <span className="text-sm">✓</span>
            </div>
            <div>
              <p className="font-medium">Improves Focus</p>
              <p className="text-sm text-muted-foreground">
                Mindful breathing enhances concentration and attention span
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
              <span className="text-sm">✓</span>
            </div>
            <div>
              <p className="font-medium">Lowers Stress</p>
              <p className="text-sm text-muted-foreground">
                Activates your parasympathetic nervous system for relaxation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
