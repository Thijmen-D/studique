import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HabitCard } from "@/components/habit-card";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Habit } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function HabitsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"]
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      return await apiRequest("POST", `/api/habits/${id}/toggle`, { date });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    }
  });

  const handleToggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    toggleHabitMutation.mutate({ id, date: today });
  };

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({ title: "Success", description: "Habit deleted successfully!" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      } else {
        toast({ title: "Error", description: "Failed to delete habit", variant: "destructive" });
      }
    }
  });

  const handleAddHabit = async (habit: { name: string; priority: string }) => {
    try {
      await apiRequest("POST", "/api/habits", habit);
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({ title: "Success", description: "Habit added successfully!" });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      } else {
        toast({ title: "Error", description: "Failed to add habit", variant: "destructive" });
      }
    }
  };

  const renderHabits = (filteredHabits: Habit[]) => {
    if (isLoading) {
      return <Card className="p-6 text-center text-muted-foreground">Loading...</Card>;
    }

    if (filteredHabits.length === 0) {
      return <Card className="p-6 text-center text-muted-foreground">No habits found. Add one to get started!</Card>;
    }

    return filteredHabits.map((habit) => {
      const today = new Date().toISOString().split('T')[0];
      const completed = habit.completedDates.includes(today);
      return (
        <HabitCard
          key={habit.id}
          name={habit.name}
          priority={habit.priority as any}
          streak={habit.streak}
          completed={completed}
          onToggle={() => handleToggleHabit(habit.id)}
          onDelete={() => deleteHabitMutation.mutate(habit.id)}
        />
      );
    });
  };

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
          {renderHabits(habits)}
        </TabsContent>
        
        <TabsContent value="high" className="space-y-3 mt-6">
          {renderHabits(habits.filter(h => h.priority === "high"))}
        </TabsContent>
        
        <TabsContent value="medium" className="space-y-3 mt-6">
          {renderHabits(habits.filter(h => h.priority === "medium"))}
        </TabsContent>
        
        <TabsContent value="low" className="space-y-3 mt-6">
          {renderHabits(habits.filter(h => h.priority === "low"))}
        </TabsContent>
      </Tabs>

      <AddHabitDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddHabit}
      />
    </div>
  );
}
