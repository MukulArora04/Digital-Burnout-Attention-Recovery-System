import { PeriodicReport } from '@/components/PeriodicReport';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Behavioral Reports</h2>
        <p className="text-muted-foreground">
          Understand your patterns and improve your productivity habits
        </p>
      </div>

      <PeriodicReport />
    </div>
  );
}
