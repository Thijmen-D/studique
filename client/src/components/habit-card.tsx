import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Trash2 } from "lucide-react";

interface HabitCardProps {
  name: string;
  priority: "high" | "medium" | "low";
  streak: number;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function HabitCard({ name, priority, streak, completed, onToggle, onDelete }: HabitCardProps) {
  const priorityColors = {
    high: "border-l-destructive",
    medium: "border-l-warning",
    low: "border-l-success"
  };

  return (
    <Card className={`p-4 border-l-4 ${priorityColors[priority]} hover-elevate`}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={completed}
          onCheckedChange={onToggle}
          className="h-6 w-6"
          data-testid={`checkbox-habit-${name.toLowerCase().replace(/\s+/g, '-')}`}
        />
        <div className="flex-1">
          <p className={`font-medium ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`} data-testid={`text-habit-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {name}
          </p>
        </div>
        {streak > 0 && (
          <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning border-warning/20" data-testid={`badge-streak-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            <Flame className="h-3 w-3" />
            {streak}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
