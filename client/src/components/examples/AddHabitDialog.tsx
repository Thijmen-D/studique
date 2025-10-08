import { AddHabitDialog } from '../add-habit-dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddHabitDialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <AddHabitDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={(habit) => console.log('Added habit:', habit)}
      />
    </div>
  );
}
