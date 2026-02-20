import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWalkBreakTimer } from '@/hooks/useWalkBreakTimer';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function WalkBreak() {
  const [duration, setDuration] = useState(15);
  const { timeRemaining, formattedTime, progress, isRunning, startTimer, pauseTimer, resetTimer } =
    useWalkBreakTimer();

  const handleStart = () => {
    if (!isRunning) {
      startTimer(duration * 60);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Walk Break</h2>
        <p className="text-muted-foreground">
          Set a timer for your walk and return before the alarm sounds
        </p>
      </div>

      {/* Timer Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Walk Timer</CardTitle>
              <CardDescription>
                {isRunning ? 'Your break is in progress' : 'Set your break duration'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Break Duration (minutes)</Label>
                <div className="flex gap-4 mt-2">
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(5, Math.min(60, Number(e.target.value))))}
                    className="text-lg"
                  />
                  <Button size="lg" onClick={handleStart} className="gap-2 min-w-32">
                    <Play className="h-5 w-5" />
                    Start
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                {[5, 10, 15, 20, 30].map((min) => (
                  <Button
                    key={min}
                    variant="outline"
                    size="sm"
                    onClick={() => setDuration(min)}
                  >
                    {min}m
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-6xl font-bold mb-2">{formattedTime}</p>
                <p className="text-muted-foreground">
                  {timeRemaining > 60
                    ? 'Enjoy your walk!'
                    : 'Time to head back!'}
                </p>
              </div>

              <Progress value={progress} className="h-3" />

              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="outline" onClick={pauseTimer} className="gap-2">
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
                <Button size="lg" variant="outline" onClick={resetTimer} className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  End Break
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Make It Count</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Leave your phone at your desk</p>
            <p>• Get some fresh air if possible</p>
            <p>• Stretch your legs and back</p>
            <p>• Stay hydrated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why Walk Breaks Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Increases blood flow to the brain</p>
            <p>• Reduces eye strain from screens</p>
            <p>• Improves mood and energy</p>
            <p>• Prevents prolonged sitting</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 mt-0.5">
              <span className="text-amber-600 dark:text-amber-400">⚠</span>
            </div>
            <div>
              <p className="font-medium mb-1">Return on Time</p>
              <p className="text-sm text-muted-foreground">
                An alarm will sound when your break time is up. Returning late can disrupt your
                productivity rhythm and make it harder to get back into focus mode.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
