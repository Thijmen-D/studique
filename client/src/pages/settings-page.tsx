import { Card } from "@/components/ui/card";
import { ThemeSelector } from "@/components/theme-selector";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { UserSettings } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";

export function SettingsPage() {
  const { theme, setTheme, darkMode, isDark, setDarkMode } = useTheme();
  const { user } = useAuth();

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"]
  });

  // Sync theme with user settings
  useEffect(() => {
    if (settings) {
      setTheme(settings.theme as any);
      setDarkMode(settings.darkMode as any);
    }
  }, [settings, setTheme, setDarkMode]);

  const handleThemeChange = async (newTheme: "t1" | "t2" | "t3") => {
    setTheme(newTheme);
    try {
      await apiRequest("PATCH", "/api/settings", { theme: newTheme });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    } catch (error) {
      console.error("Failed to save theme setting:", error);
    }
  };

  const handleDarkModeChange = async (mode: "light" | "dark" | "auto") => {
    setDarkMode(mode);
    try {
      await apiRequest("PATCH", "/api/settings", { darkMode: mode });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    } catch (error) {
      console.error("Failed to save dark mode setting:", error);
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="space-y-6 p-6 pb-24 md:pb-6" data-testid="page-settings">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {(user as any)?.firstName && (user as any)?.lastName 
                ? `${(user as any).firstName} ${(user as any).lastName}`
                : (user as any)?.email || "Student"}
            </p>
            <p className="text-sm text-muted-foreground">{(user as any)?.email || "Not logged in"}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </Card>

      <ThemeSelector selectedTheme={theme} onThemeChange={handleThemeChange} />

      <DarkModeToggle mode={darkMode} isDark={isDark} onModeChange={handleDarkModeChange} />

      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-foreground">About</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>StudyFlow v1.0.0</p>
          <p>A productivity app for students</p>
        </div>
      </Card>
    </div>
  );
}
