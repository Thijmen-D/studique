import { Button } from "@/components/ui/button";
import { ExamCard } from "@/components/exam-card";
import { AddExamDialog } from "@/components/add-exam-dialog";
import { ExamChart } from "@/components/exam-chart";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ExamsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);

  const exams = [
    {
      id: 1,
      title: "Mathematics Final",
      subject: "Calculus",
      date: tomorrow,
      difficulty: "hard" as const,
      progress: 75,
      status: "in-progress" as const
    },
    {
      id: 2,
      title: "Physics Midterm",
      subject: "Mechanics",
      date: nextWeek,
      difficulty: "medium" as const,
      progress: 40,
      status: "in-progress" as const
    },
    {
      id: 3,
      title: "Chemistry Quiz",
      subject: "Organic Chemistry",
      date: twoWeeks,
      difficulty: "easy" as const,
      progress: 10,
      status: "not-started" as const
    },
  ];

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-exams">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exams</h1>
          <p className="text-muted-foreground">Manage your upcoming exams and track progress</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2" data-testid="button-add-exam">
          <Plus className="h-4 w-4" />
          Add Exam
        </Button>
      </div>

      <div className="max-w-sm">
        <ExamChart completed={8} total={12} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="in-progress" data-testid="tab-in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} {...exam} />
          ))}
        </TabsContent>
        
        <TabsContent value="upcoming" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {exams.filter(e => e.status === "not-started").map((exam) => (
            <ExamCard key={exam.id} {...exam} />
          ))}
        </TabsContent>
        
        <TabsContent value="in-progress" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {exams.filter(e => e.status === "in-progress").map((exam) => (
            <ExamCard key={exam.id} {...exam} />
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {exams.filter(e => e.status === "completed").map((exam) => (
            <ExamCard key={exam.id} {...exam} />
          ))}
        </TabsContent>
      </Tabs>

      <AddExamDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(exam) => console.log("Added exam:", exam)}
      />
    </div>
  );
}
