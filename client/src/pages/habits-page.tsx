import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HabitCard } from "@/components/habit-card";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function HabitsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const habits = [
    { id: 1, name: "Study for 2 hours", priority: "high" as const, streak: 7, completed: true },
    { id: 2, name: "Exercise 30 minutes", priority: "medium" as const, streak: 3, completed: false },
    { id: 3, name: "Read 20 pages", priority: "low" as const, streak: 5, completed: false },
    { id: 4, name: "Practice coding", priority: "high" as const, streak: 12, completed: true },
    { id: 5, name: "Meditation 10 min", priority: "low" as const, streak: 2, completed: false },
  ];

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-habits">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Habits</h1>
          <p className="text-muted-foreground">Track your daily habits and build streaks</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2" data-testid="button-add-habit">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="high" data-testid="tab-high">High Priority</TabsTrigger>
          <TabsTrigger value="medium" data-testid="tab-medium">Medium</TabsTrigger>
          <TabsTrigger value="low" data-testid="tab-low">Low</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3 mt-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              priority={habit.priority}
              streak={habit.streak}
              completed={habit.completed}
              onToggle={() => console.log(`Toggled ${habit.name}`)}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="high" className="space-y-3 mt-6">
          {habits.filter(h => h.priority === "high").map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              priority={habit.priority}
              streak={habit.streak}
              completed={habit.completed}
              onToggle={() => console.log(`Toggled ${habit.name}`)}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="medium" className="space-y-3 mt-6">
          {habits.filter(h => h.priority === "medium").map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              priority={habit.priority}
              streak={habit.streak}
              completed={habit.completed}
              onToggle={() => console.log(`Toggled ${habit.name}`)}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="low" className="space-y-3 mt-6">
          {habits.filter(h => h.priority === "low").map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              priority={habit.priority}
              streak={habit.streak}
              completed={habit.completed}
              onToggle={() => console.log(`Toggled ${habit.name}`)}
            />
          ))}
        </TabsContent>
      </Tabs>

      <AddHabitDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={(habit) => console.log("Added habit:", habit)}
      />
    </div>
  );
}
