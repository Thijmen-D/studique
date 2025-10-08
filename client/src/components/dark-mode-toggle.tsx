import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DarkModeToggleProps {
  mode: "light" | "dark" | "auto";
  isDark: boolean;
  onModeChange: (mode: "light" | "dark" | "auto") => void;
}

export function DarkModeToggle({ mode, isDark, onModeChange }: DarkModeToggleProps) {
  return (
    <Card className="p-6" data-testid="card-dark-mode">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Dark Mode</h3>
          <div className="flex gap-2">
            <Button
              variant={mode === "light" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => onModeChange("light")}
              data-testid="button-mode-light"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={mode === "dark" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => onModeChange("dark")}
              data-testid="button-mode-dark"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={mode === "auto" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => onModeChange("auto")}
              data-testid="button-mode-auto"
            >
              <Clock className="h-4 w-4" />
              Auto
            </Button>
          </div>
        </div>

        {mode === "auto" && (
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              Auto mode switches to light at 10:00 AM and dark at 6:00 PM
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="dark-toggle" className="text-sm text-foreground">
            Current mode: {isDark ? "Dark" : "Light"}
          </Label>
          <Switch
            id="dark-toggle"
            checked={isDark}
            disabled={mode === "auto"}
            onCheckedChange={(checked) => onModeChange(checked ? "dark" : "light")}
            data-testid="switch-dark-mode"
          />
        </div>
      </div>
    </Card>
  );
}
