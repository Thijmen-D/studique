import { Card } from "@/components/ui/card";
import { ThemeSelector } from "@/components/theme-selector";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme, darkMode, isDark, setDarkMode } = useTheme();

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
            <p className="font-semibold text-foreground">Student Name</p>
            <p className="text-sm text-muted-foreground">student@example.com</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" data-testid="button-logout">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </Card>

      <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />

      <DarkModeToggle mode={darkMode} isDark={isDark} onModeChange={setDarkMode} />

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
