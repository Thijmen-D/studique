import { Card } from "@/components/ui/card";
import { GradeDisplay } from "@/components/grade-display";
import { Award } from "lucide-react";

export function GradesPage() {
  const subjects = [
    { id: 1, subject: "Mathematics", grade: 92, weight: 2 },
    { id: 2, subject: "Physics", grade: 85, weight: 2 },
    { id: 3, subject: "Chemistry", grade: 78, weight: 1 },
    { id: 4, subject: "English", grade: 88, weight: 1 },
    { id: 5, subject: "History", grade: 90, weight: 1 },
    { id: 6, subject: "Biology", grade: 82, weight: 1 },
  ];

  const totalWeightedGrade = subjects.reduce((sum, s) => sum + (s.grade * s.weight), 0);
  const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0);
  const average = (totalWeightedGrade / totalWeight).toFixed(1);

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-grades">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grades</h1>
        <p className="text-muted-foreground">Track your academic performance</p>
      </div>

      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Average</p>
            <p className="text-5xl font-bold text-primary" data-testid="text-overall-average">{average}</p>
            <p className="text-sm text-muted-foreground mt-2">Weighted GPA</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <GradeDisplay key={subject.id} {...subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
