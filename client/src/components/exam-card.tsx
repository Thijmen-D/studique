import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ExamCardProps {
  title: string;
  subject: string;
  date: Date;
  difficulty: "easy" | "medium" | "hard";
  progress: number;
  status: "not-started" | "in-progress" | "completed";
}

export function ExamCard({ title, subject, date, difficulty, progress, status }: ExamCardProps) {
  const difficultyColors = {
    easy: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    hard: "bg-destructive/10 text-destructive border-destructive/20"
  };

  const statusColors = {
    "not-started": "bg-muted text-muted-foreground",
    "in-progress": "bg-accent text-accent-foreground",
    "completed": "bg-primary text-primary-foreground"
  };

  const daysUntil = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-exam-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground" data-testid={`text-exam-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</h3>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
          <Badge variant="secondary" className={difficultyColors[difficulty]} data-testid={`badge-difficulty-${difficulty}`}>
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{daysUntil}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" data-testid={`progress-exam-${title.toLowerCase().replace(/\s+/g, '-')}`} />
        </div>

        <Badge className={statusColors[status]} data-testid={`badge-status-${status}`}>
          {status.replace("-", " ")}
        </Badge>
      </div>
    </Card>
  );
}
