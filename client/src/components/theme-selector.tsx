import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: "t1" | "t2" | "t3";
  onThemeChange: (theme: "t1" | "t2" | "t3") => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = [
    {
      id: "t1" as const,
      name: "Academic Blue",
      colors: ["#424874", "#A6B1E1", "#F49390", "#ECE4B7", "#355070"]
    },
    {
      id: "t2" as const,
      name: "Natural Tones",
      colors: ["#98C1D9", "#6969B3", "#B27C66", "#F6F5AE", "#45503B"]
    },
    {
      id: "t3" as const,
      name: "Soft Pastel",
      colors: ["#FCEFEF", "#7FD8BE", "#A1FCDF", "#FCD29F", "#FCAB64"]
    }
  ];

  return (
    <div className="space-y-4" data-testid="theme-selector">
      <h3 className="font-semibold text-foreground">Color Theme</h3>
      <div className="grid gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <Card
              key={theme.id}
              className={`p-4 cursor-pointer hover-elevate ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onThemeChange(theme.id)}
              data-testid={`button-theme-${theme.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">{theme.name}</span>
                {isSelected && <Check className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex gap-2">
                {theme.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="h-8 flex-1 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
