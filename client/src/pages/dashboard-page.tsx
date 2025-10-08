import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habit-card";
import { ExamCard } from "@/components/exam-card";
import { StatCard } from "@/components/stat-card";
import { QuoteCard } from "@/components/quote-card";
import { MoodSelector } from "@/components/mood-selector";
import { ExamChart } from "@/components/exam-chart";
import { Award, Target, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";

export function DashboardPage() {
  const [mood, setMood] = useState<"happy" | "tired" | "stressed" | "focused">("happy");
  const [energy, setEnergy] = useState(3);
  
  const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Study while others are sleeping; work while others are loafing.",
    "Your limitation—it's only your imagination."
  ];
  
  const todayQuote = quotes[new Date().getDate() % quotes.length];
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your progress overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Average Grade"
          value="8.5"
          icon={Award}
          subtitle="+0.5 from last month"
          trend="up"
        />
        <StatCard
          title="Active Habits"
          value="12"
          icon={Target}
          subtitle="5 completed today"
        />
        <StatCard
          title="Study Streak"
          value="7"
          icon={TrendingUp}
          subtitle="Days in a row"
          trend="up"
        />
      </div>

      <QuoteCard quote={todayQuote} author="Daily Motivation" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Today's Habits</h2>
            <Button size="sm" className="gap-2" data-testid="button-add-habit">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            <HabitCard
              name="Study for 2 hours"
              priority="high"
              streak={7}
              completed={true}
              onToggle={() => console.log("toggled")}
            />
            <HabitCard
              name="Exercise 30 minutes"
              priority="medium"
              streak={3}
              completed={false}
              onToggle={() => console.log("toggled")}
            />
            <HabitCard
              name="Read 20 pages"
              priority="low"
              streak={5}
              completed={false}
              onToggle={() => console.log("toggled")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Exams</h2>
            <Button size="sm" className="gap-2" data-testid="button-add-exam">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <ExamCard
            title="Mathematics Final"
            subject="Calculus"
            date={nextWeek}
            difficulty="hard"
            progress={45}
            status="in-progress"
          />
          <ExamChart completed={8} total={12} />
        </div>
      </div>

      <MoodSelector
        selectedMood={mood}
        energy={energy}
        onMoodChange={setMood}
        onEnergyChange={setEnergy}
      />
    </div>
  );
}
