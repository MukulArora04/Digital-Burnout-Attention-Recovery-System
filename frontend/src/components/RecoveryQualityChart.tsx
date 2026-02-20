import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBreakAnalytics } from '@/hooks/useBreakAnalytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function RecoveryQualityChart() {
  const { restorativePercentage, nonRestorativePercentage, restorativeTime, nonRestorativeTime } =
    useBreakAnalytics();

  const data = [
    { name: 'Restorative', value: restorativePercentage, time: restorativeTime },
    { name: 'Non-Restorative', value: nonRestorativePercentage, time: nonRestorativeTime },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-3))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Quality</CardTitle>
        <CardDescription>How restorative are your breaks?</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${props.payload.time} min (${value.toFixed(0)}%)`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Restorative breaks:</strong> Walking, breathing exercises, or complete rest
          </p>
          <p>
            <strong>Non-restorative:</strong> Passive browsing or social media during breaks
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
