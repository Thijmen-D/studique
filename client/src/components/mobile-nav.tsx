import { Home, Target, BookOpen, Award, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  active: string;
  onNavigate: (page: string) => void;
}

export function MobileNav({ active, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "habits", icon: Target, label: "Habits" },
    { id: "exams", icon: BookOpen, label: "Exams" },
    { id: "grades", icon: Award, label: "Grades" },
    { id: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe" data-testid="nav-mobile">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => onNavigate(item.id)}
              data-testid={`button-nav-${item.id}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
