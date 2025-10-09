import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface AddExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (exam: any) => void;
  initialExam?: any;
}

export function AddExamDialog({ open, onOpenChange, onAdd, initialExam }: AddExamDialogProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("not-started");

  useEffect(() => {
    if (initialExam) {
      setTitle(initialExam.title || "");
      setSubject(initialExam.subject?.name || initialExam.subject || "");
      setDate(initialExam.date || "");
      setDifficulty(initialExam.difficulty || "medium");
      setNotes(initialExam.notes || "");
      setProgress(initialExam.progress || 0);
      setStatus(initialExam.status || "not-started");
    } else {
      setTitle("");
      setSubject("");
      setDate("");
      setDifficulty("medium");
      setNotes("");
      setProgress(0);
      setStatus("not-started");
    }
  }, [initialExam, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && subject.trim() && date) {
      onAdd({ 
        title, 
        subject, 
        date, 
        difficulty, 
        notes,
        progress,
        status
      });
      setTitle("");
      setSubject("");
      setDate("");
      setDifficulty("medium");
      setNotes("");
      setProgress(0);
      setStatus("not-started");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="dialog-add-exam">
        <DialogHeader>
          <DialogTitle>{initialExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exam-title">Exam Title</Label>
              <Input
                id="exam-title"
                placeholder="e.g., Midterm Exam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-exam-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-testid="input-subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="input-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {initialExam && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress: {progress}%</Label>
                  <Slider
                    id="progress"
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    max={100}
                    step={5}
                    data-testid="slider-progress"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Study chapters, topics to review..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="textarea-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-add-exam">
              {initialExam ? 'Save Changes' : 'Add Exam'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
