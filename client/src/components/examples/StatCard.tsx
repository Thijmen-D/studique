import { StatCard } from '../stat-card';
import { Award, Target, TrendingUp } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-3">
      <StatCard
        title="Average Grade"
        value="8.5"
        icon={Award}
        subtitle="+0.5 from last month"
        trend="up"
      />
      <StatCard
        title="Habits Completed"
        value="24"
        icon={Target}
        subtitle="This week"
      />
      <StatCard
        title="Study Streak"
        value="12"
        icon={TrendingUp}
        subtitle="Days"
        trend="up"
      />
    </div>
  );
}
