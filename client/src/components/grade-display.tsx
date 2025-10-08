import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GradeDisplayProps {
  subject: string;
  grade: number;
  weight: number;
  maxGrade?: number;
}

export function GradeDisplay({ subject, grade, weight, maxGrade = 100 }: GradeDisplayProps) {
  const percentage = (grade / maxGrade) * 100;
  
  const getGradeColor = (pct: number) => {
    if (pct >= 90) return "text-success";
    if (pct >= 75) return "text-primary";
    if (pct >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-grade-${subject.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground" data-testid={`text-subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}>{subject}</h3>
          <span className={`text-2xl font-bold ${getGradeColor(percentage)}`} data-testid={`text-grade-${subject.toLowerCase().replace(/\s+/g, '-')}`}>
            {grade}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Weight: {weight}x</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
