import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { MobileNav } from "@/components/mobile-nav";
import { DashboardPage } from "@/pages/dashboard-page";
import { HabitsPage } from "@/pages/habits-page";
import { ExamsPage } from "@/pages/exams-page";
import { GradesPage } from "@/pages/grades-page";
import { SettingsPage } from "@/pages/settings-page";
import { useState, useEffect } from "react";
import { Home, Target, BookOpen, Award, Settings, Moon, Sun, BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/lib/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

function DesktopSidebar({ active, onNavigate }: { active: string; onNavigate: (page: string) => void }) {
  const { toggleDark, isDark } = useTheme();
  
  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "habits", icon: Target, label: "Habits" },
    { id: "exams", icon: BookOpen, label: "Exams" },
    { id: "grades", icon: Award, label: "Grades" },
    { id: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-sidebar border-r border-sidebar-border" data-testid="sidebar-desktop">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">StudyFlow</h1>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => onNavigate(item.id)}
                data-testid={`button-nav-${item.id}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3"
            onClick={toggleDark}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <BookOpenIcon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">StudyFlow</h1>
          <p className="text-muted-foreground">Your productivity companion for academic success</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left">
            <Target className="h-5 w-5 text-primary" />
            <p className="text-sm text-foreground">Track daily habits and build streaks</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="text-sm text-foreground">Manage exams and study schedules</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Award className="h-5 w-5 text-primary" />
            <p className="text-sm text-foreground">Monitor grades and academic performance</p>
          </div>
        </div>

        <Button onClick={handleLogin} className="w-full" size="lg" data-testid="button-login">
          Get Started
        </Button>
      </Card>
    </div>
  );
}

function AppContent() {
  const [activePage, setActivePage] = useState("dashboard");
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access StudyFlow",
      });
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar active={activePage} onNavigate={setActivePage} />
      
      <div className="md:pl-64">
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "habits" && <HabitsPage />}
        {activePage === "exams" && <ExamsPage />}
        {activePage === "grades" && <GradesPage />}
        {activePage === "settings" && <SettingsPage />}
      </div>

      <MobileNav active={activePage} onNavigate={setActivePage} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
