import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BurnoutBreakdownChartProps {
  timeBasedContribution: number;
  switchingContribution: number;
  totalBurnoutIndex: number;
}

/**
 * BurnoutBreakdownChart visualizes the components of the burnout index
 * 
 * Shows:
 * - Time-based burnout (Δt × Weight_app): Time spent in distracting applications
 * - Switching-based burnout (SwitchCount × σ): Mental cost of context switching
 * 
 * Uses a pie chart to show relative contributions to total burnout score
 */
export function BurnoutBreakdownChart({
  timeBasedContribution,
  switchingContribution,
  totalBurnoutIndex,
}: BurnoutBreakdownChartProps) {
  // Prepare data for pie chart
  const data = [
    {
      name: 'Time in Distracting Apps',
      value: Math.max(timeBasedContribution, 0.1), // Ensure visible slice
      rawValue: timeBasedContribution,
    },
    {
      name: 'Context Switching Penalty',
      value: Math.max(switchingContribution, 0.1), // Ensure visible slice
      rawValue: switchingContribution,
    },
  ];

  // Warm, supportive color palette matching the app theme
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))'];

  // Custom tooltip to show actual values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.rawValue.toFixed(2)} points
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burnout Index Breakdown</CardTitle>
        <CardDescription>
          Understanding what contributes to your burnout score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Burnout Index</p>
            <p className="text-4xl font-bold text-primary">{totalBurnoutIndex.toFixed(1)}</p>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm">
                    {value}: {entry.payload.rawValue.toFixed(1)} pts
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="font-semibold text-foreground">💡 Tip:</span>
              <span>
                Reduce time-based burnout by focusing on productive applications. 
                Reduce switching burnout by staying in one app longer.
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
