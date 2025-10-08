import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ExamChartProps {
  completed: number;
  total: number;
}

export function ExamChart({ completed, total }: ExamChartProps) {
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining }
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <Card className="p-6" data-testid="card-exam-chart">
      <h3 className="font-semibold mb-4 text-foreground">Exam Progress</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-foreground" data-testid="text-exam-percentage">{percentage}%</span>
          <span className="text-sm text-muted-foreground">{completed}/{total} exams</span>
        </div>
      </div>
    </Card>
  );
}
