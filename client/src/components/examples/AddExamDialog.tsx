import { AddExamDialog } from '../add-exam-dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddExamDialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Add Exam</Button>
      <AddExamDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={(exam) => console.log('Added exam:', exam)}
      />
    </div>
  );
}
