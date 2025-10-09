import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExamCard } from "@/components/exam-card";
import { AddExamDialog } from "@/components/add-exam-dialog";
import { ExamChart } from "@/components/exam-chart";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ExamWithSubject, Subject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function ExamsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamWithSubject | null>(null);
  const { toast } = useToast();

  const { data: exams = [], isLoading } = useQuery<ExamWithSubject[]>({
    queryKey: ["/api/exams"]
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"]
  });

  const deleteExamMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/exams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
      toast({ title: "Success", description: "Exam deleted successfully!" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      } else {
        toast({ title: "Error", description: "Failed to delete exam", variant: "destructive" });
      }
    }
  });

  const handleAddExam = async (exam: any) => {
    try {
      let subjectId = exam.subjectId;
      
      // If no subject exists, create one
      if (!subjectId && subjects.length === 0) {
        const response = await apiRequest("POST", "/api/subjects", {
          name: exam.subject,
          color: '#4287f5'
        });
        const newSubject = await response.json();
        subjectId = newSubject.id;
        queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      } else if (!subjectId) {
        // Try to find existing subject by name
        const existingSubject = subjects.find(s => s.name.toLowerCase() === exam.subject.toLowerCase());
        if (existingSubject) {
          subjectId = existingSubject.id;
        } else {
          // Create new subject
          const response = await apiRequest("POST", "/api/subjects", {
            name: exam.subject,
            color: '#4287f5'
          });
          const newSubject = await response.json();
          subjectId = newSubject.id;
          queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
        }
      }

      await apiRequest("POST", "/api/exams", {
        title: exam.title,
        subjectId,
        date: exam.date,
        difficulty: exam.difficulty || 'medium',
        progress: exam.progress || 0,
        status: exam.status || 'not-started',
        weight: 1,
        notes: exam.notes || null
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
      toast({ title: "Success", description: "Exam added successfully!" });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      } else {
        toast({ title: "Error", description: "Failed to add exam", variant: "destructive" });
      }
    }
  };

  const renderExams = (filteredExams: ExamWithSubject[]) => {
    if (isLoading) {
      return <Card className="p-6 text-center text-muted-foreground">Loading...</Card>;
    }

    if (filteredExams.length === 0) {
      return <Card className="p-6 text-center text-muted-foreground">No exams found. Add one to get started!</Card>;
    }

    return filteredExams.map((exam) => (
      <ExamCard
        key={exam.id}
        title={exam.title}
        subject={exam.subject.name}
        date={new Date(exam.date)}
        difficulty={exam.difficulty as any}
        progress={exam.progress}
        status={exam.status as any}
        onDelete={() => deleteExamMutation.mutate(exam.id)}
        onEdit={() => {
          setEditingExam(exam);
          setAddDialogOpen(true);
        }}
      />
    ));
  };

  const completedExams = exams.filter(e => e.status === "completed");
  const inProgressExams = exams.filter(e => e.status === "in-progress");
  const upcomingExams = exams.filter(e => e.status === "not-started");

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
        <ExamChart completed={completedExams.length} total={exams.length} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="in-progress" data-testid="tab-in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {renderExams(exams)}
        </TabsContent>
        
        <TabsContent value="upcoming" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {renderExams(upcomingExams)}
        </TabsContent>
        
        <TabsContent value="in-progress" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {renderExams(inProgressExams)}
        </TabsContent>
        
        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {renderExams(completedExams)}
        </TabsContent>
      </Tabs>

      <AddExamDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingExam(null);
        }}
        onAdd={async (exam) => {
          if (editingExam) {
            try {
              await apiRequest("PATCH", `/api/exams/${editingExam.id}`, {
                ...exam,
                progress: exam.progress || editingExam.progress,
                status: exam.status || editingExam.status,
              });
              queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
              toast({ title: "Success", description: "Exam updated successfully!" });
              setAddDialogOpen(false);
              setEditingExam(null);
            } catch (error: any) {
              if (isUnauthorizedError(error)) {
                toast({ title: "Unauthorized", description: "You are logged out", variant: "destructive" });
              } else {
                toast({ title: "Error", description: "Failed to update exam", variant: "destructive" });
              }
            }
          } else {
            await handleAddExam(exam);
            setAddDialogOpen(false);
          }
        }}
      />
    </div>
  );
}
