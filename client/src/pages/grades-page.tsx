import { Card } from "@/components/ui/card";
import { GradeDisplay } from "@/components/grade-display";
import { Award, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { GradeWithSubject, Subject } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function GradesPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("1");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const { data: grades = [], isLoading } = useQuery<GradeWithSubject[]>({
    queryKey: ["/api/grades"]
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"]
  });

  const deleteGradeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/grades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grades"] });
      toast({ title: "Success", description: "Grade deleted successfully!" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to delete grade", variant: "destructive" });
      }
    }
  });

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("POST", "/api/grades", {
        subjectId,
        value: parseFloat(grade),
        weight: parseInt(weight),
        description: description || null
      });
      queryClient.invalidateQueries({ queryKey: ["/api/grades"] });
      setAddDialogOpen(false);
      setSubjectId("");
      setGrade("");
      setWeight("1");
      setDescription("");
      toast({ title: "Success", description: "Grade added successfully!" });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      } else {
        toast({ title: "Error", description: "Failed to add grade", variant: "destructive" });
      }
    }
  };

  // Group grades by subject and calculate averages (out of 10)
  const subjectGrades = subjects.map(subject => {
    const subjectGradesList = grades.filter(g => g.subjectId === subject.id);
    if (subjectGradesList.length === 0) return null;

    const totalWeighted = subjectGradesList.reduce((sum, g) => sum + (g.value * g.weight), 0);
    const totalWeight = subjectGradesList.reduce((sum, g) => sum + g.weight, 0);
    const average = totalWeight > 0 ? (totalWeighted / totalWeight) : 0;

    return {
      subject: subject.name,
      grade: Number(average.toFixed(1)),
      weight: totalWeight
    };
  }).filter(Boolean);

  const totalWeightedGrade = subjectGrades.reduce((sum, s) => s ? sum + (s.grade * s.weight) : sum, 0);
  const totalWeight = subjectGrades.reduce((sum, s) => s ? sum + s.weight : sum, 0);
  const overallAverage = totalWeight > 0 ? (totalWeightedGrade / totalWeight).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-grades">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grades</h1>
          <p className="text-muted-foreground">Track your academic performance</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2" data-testid="button-add-grade">
          <Plus className="h-4 w-4" />
          Add Grade
        </Button>
      </div>

      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Average</p>
            <p className="text-5xl font-bold text-primary" data-testid="text-overall-average">{overallAverage}</p>
            <p className="text-sm text-muted-foreground mt-2">out of 10</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Subjects</h2>
        {isLoading ? (
          <Card className="p-6 text-center text-muted-foreground">Loading...</Card>
        ) : subjectGrades.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No grades yet. Add your first grade to get started!
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {subjects.map((subject) => {
              const subjectGradesList = grades.filter(g => g.subjectId === subject.id);
              if (subjectGradesList.length === 0) return null;

              const totalWeighted = subjectGradesList.reduce((sum, g) => sum + (g.value * g.weight), 0);
              const totalWeight = subjectGradesList.reduce((sum, g) => sum + g.weight, 0);
              const average = totalWeight > 0 ? (totalWeighted / totalWeight).toFixed(1) : "0.0";

              return (
                <AccordionItem key={subject.id} value={subject.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-2xl font-bold text-primary">{average}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {subjectGradesList.map((grade) => (
                        <Card key={grade.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{grade.value}</span>
                                <span className="text-sm text-muted-foreground">
                                  {grade.description && `• ${grade.description}`}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">Weight: {grade.weight}x</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGradeMutation.mutate(grade.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent data-testid="dialog-add-grade">
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddGrade}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subjectId} onValueChange={setSubjectId} required>
                  <SelectTrigger id="subject" data-testid="select-subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (1-10)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  data-testid="input-grade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  data-testid="input-weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g., Midterm exam, Quiz 1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="input-description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" data-testid="button-add-grade-submit">Add Grade</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
