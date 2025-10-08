import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habit-card";
import { ExamCard } from "@/components/exam-card";
import { StatCard } from "@/components/stat-card";
import { QuoteCard } from "@/components/quote-card";
import { MoodSelector } from "@/components/mood-selector";
import { ExamChart } from "@/components/exam-chart";
import { Award, Target, TrendingUp, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Habit, ExamWithSubject, Mood } from "@shared/schema";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { AddExamDialog } from "@/components/add-exam-dialog";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function DashboardPage() {
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [addExamOpen, setAddExamOpen] = useState(false);
  const { toast } = useToast();

  const { data: habits = [] } = useQuery<Habit[]>({
    queryKey: ["/api/habits"]
  });

  const { data: exams = [] } = useQuery<ExamWithSubject[]>({
    queryKey: ["/api/exams"]
  });

  const { data: todayMood } = useQuery<Mood | null>({
    queryKey: ["/api/moods/today"]
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

  const saveMoodMutation = useMutation({
    mutationFn: async (mood: { mood: string; energy: number; date: string }) => {
      return await apiRequest("POST", "/api/moods", mood);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods/today"] });
      toast({ title: "Success", description: "Mood saved!" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    }
  });

  const [selectedMood, setSelectedMood] = useState<"happy" | "tired" | "stressed" | "focused">("happy");
  const [energy, setEnergy] = useState(3);

  useEffect(() => {
    if (todayMood) {
      setSelectedMood(todayMood.mood as any);
      setEnergy(todayMood.energy);
    }
  }, [todayMood]);

  const handleMoodChange = (mood: "happy" | "tired" | "stressed" | "focused") => {
    setSelectedMood(mood);
    const today = new Date().toISOString().split('T')[0];
    saveMoodMutation.mutate({ mood, energy, date: today });
  };

  const handleEnergyChange = (newEnergy: number) => {
    setEnergy(newEnergy);
    const today = new Date().toISOString().split('T')[0];
    saveMoodMutation.mutate({ mood: selectedMood, energy: newEnergy, date: today });
  };

  const handleToggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    toggleHabitMutation.mutate({ id, date: today });
  };

  const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Study while others are sleeping; work while others are loafing.",
    "Your limitation—it's only your imagination."
  ];
  
  const todayQuote = quotes[new Date().getDate() % quotes.length];
  
  const completedHabitsToday = habits.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return h.completedDates.includes(today);
  }).length;

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;

  const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).slice(0, 2);
  const completedExams = exams.filter(e => e.status === "completed").length;

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your progress overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Active Habits"
          value={habits.length}
          icon={Target}
          subtitle={`${completedHabitsToday} completed today`}
        />
        <StatCard
          title="Study Streak"
          value={avgStreak}
          icon={TrendingUp}
          subtitle="Average streak"
          trend="up"
        />
        <StatCard
          title="Exams Progress"
          value={completedExams}
          icon={Award}
          subtitle={`of ${exams.length} total`}
        />
      </div>

      <QuoteCard quote={todayQuote} author="Daily Motivation" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Today's Habits</h2>
            <Button size="sm" className="gap-2" onClick={() => setAddHabitOpen(true)} data-testid="button-add-habit">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {habits.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No habits yet. Add your first habit to get started!
            </Card>
          ) : (
            <div className="space-y-3">
              {habits.slice(0, 5).map((habit) => {
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
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Exams</h2>
            <Button size="sm" className="gap-2" onClick={() => setAddExamOpen(true)} data-testid="button-add-exam">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {upcomingExams.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No upcoming exams. Add one to start tracking!
            </Card>
          ) : (
            <>
              {upcomingExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  title={exam.title}
                  subject={exam.subject.name}
                  date={new Date(exam.date)}
                  difficulty={exam.difficulty as any}
                  progress={exam.progress}
                  status={exam.status as any}
                />
              ))}
            </>
          )}
          <ExamChart completed={completedExams} total={exams.length} />
        </div>
      </div>

      <MoodSelector
        selectedMood={selectedMood}
        energy={energy}
        onMoodChange={handleMoodChange}
        onEnergyChange={handleEnergyChange}
      />

      <AddHabitDialog
        open={addHabitOpen}
        onOpenChange={setAddHabitOpen}
        onAdd={async (habit) => {
          await apiRequest("POST", "/api/habits", habit);
          queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
        }}
      />

      <AddExamDialog
        open={addExamOpen}
        onOpenChange={setAddExamOpen}
        onAdd={async (exam) => {
          console.log("Add exam:", exam);
          setAddExamOpen(false);
        }}
      />
    </div>
  );
}
