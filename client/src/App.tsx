import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { MobileNav } from "@/components/mobile-nav";
import { DashboardPage } from "@/pages/dashboard-page";
import { HabitsPage } from "@/pages/habits-page";
import { ExamsPage } from "@/pages/exams-page";
import { GradesPage } from "@/pages/grades-page";
import { SettingsPage } from "@/pages/settings-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { Route, Switch } from "wouter";
import { useState } from "react";
import { Home, Target, BookOpen, Award, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";

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
          <h1 className="text-xl font-bold text-sidebar-foreground">Studique</h1>
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

function MainApp() {
  const [activePage, setActivePage] = useState("dashboard");

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

function AppContent() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={MainApp} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
