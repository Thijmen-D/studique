import { MoodSelector } from '../mood-selector';
import { useState } from 'react';

export default function MoodSelectorExample() {
  const [mood, setMood] = useState<"happy" | "tired" | "stressed" | "focused">("happy");
  const [energy, setEnergy] = useState(3);
  
  return (
    <div className="p-4 max-w-md">
      <MoodSelector
        selectedMood={mood}
        energy={energy}
        onMoodChange={setMood}
        onEnergyChange={setEnergy}
      />
    </div>
  );
}
