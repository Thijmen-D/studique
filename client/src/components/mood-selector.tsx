import { Card } from "@/components/ui/card";
import { Smile, Frown, Meh, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MoodSelectorProps {
  selectedMood?: "happy" | "tired" | "stressed" | "focused";
  energy?: number;
  onMoodChange: (mood: "happy" | "tired" | "stressed" | "focused") => void;
  onEnergyChange: (energy: number) => void;
}

export function MoodSelector({ selectedMood, energy = 3, onMoodChange, onEnergyChange }: MoodSelectorProps) {
  const moods = [
    { id: "happy" as const, icon: Smile, label: "Happy", color: "text-success" },
    { id: "tired" as const, icon: Frown, label: "Tired", color: "text-muted-foreground" },
    { id: "stressed" as const, icon: Meh, label: "Stressed", color: "text-destructive" },
    { id: "focused" as const, icon: Zap, label: "Focused", color: "text-primary" }
  ];

  return (
    <Card className="p-6" data-testid="card-mood-selector">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4 text-foreground">How are you feeling?</h3>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.id;
              return (
                <Button
                  key={mood.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${!isSelected ? mood.color : ''}`}
                  onClick={() => onMoodChange(mood.id)}
                  data-testid={`button-mood-${mood.id}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{mood.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Energy Level</h3>
            <span className="text-sm font-medium text-muted-foreground">{energy}/5</span>
          </div>
          <Slider
            value={[energy]}
            onValueChange={(value) => onEnergyChange(value[0])}
            max={5}
            min={1}
            step={1}
            className="w-full"
            data-testid="slider-energy"
          />
        </div>
      </div>
    </Card>
  );
}
