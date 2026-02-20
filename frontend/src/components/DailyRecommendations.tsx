import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface DailyRecommendationsProps {
  recommendations: string[];
}

export function DailyRecommendations({ recommendations }: DailyRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Daily Recommendations
        </CardTitle>
        <CardDescription>Personalized tips to improve your focus</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5 shrink-0">
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              <p className="text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
