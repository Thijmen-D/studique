import { HabitCard } from '../habit-card';
import { useState } from 'react';

export default function HabitCardExample() {
  const [completed, setCompleted] = useState(false);
  
  return (
    <div className="p-4 space-y-4">
      <HabitCard
        name="Study for 2 hours"
        priority="high"
        streak={7}
        completed={completed}
        onToggle={() => setCompleted(!completed)}
      />
      <HabitCard
        name="Exercise 30 minutes"
        priority="medium"
        streak={3}
        completed={false}
        onToggle={() => console.log('toggled')}
      />
      <HabitCard
        name="Read 20 pages"
        priority="low"
        streak={0}
        completed={false}
        onToggle={() => console.log('toggled')}
      />
    </div>
  );
}
