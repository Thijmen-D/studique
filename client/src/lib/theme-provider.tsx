import { createContext, useContext, useEffect, useState } from "react";

type Theme = "t1" | "t2" | "t3";
type DarkMode = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  darkMode: DarkMode;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setDarkMode: (mode: DarkMode) => void;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "t1";
  });
  
  const [darkMode, setDarkModeState] = useState<DarkMode>(() => {
    const saved = localStorage.getItem("darkMode");
    return (saved as DarkMode) || "auto";
  });
  
  const [isDark, setIsDark] = useState(false);

  const checkAutoSchedule = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const lightHour = 10;
    const darkHour = 18;
    
    if (currentHour >= lightHour && currentHour < darkHour) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const updateDarkMode = () => {
      let shouldBeDark = false;
      
      if (darkMode === "dark") {
        shouldBeDark = true;
      } else if (darkMode === "light") {
        shouldBeDark = false;
      } else {
        shouldBeDark = checkAutoSchedule();
      }
      
      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateDarkMode();
    localStorage.setItem("darkMode", darkMode);

    if (darkMode === "auto") {
      const interval = setInterval(updateDarkMode, 60000);
      return () => clearInterval(interval);
    }
  }, [darkMode]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setDarkMode = (mode: DarkMode) => {
    setDarkModeState(mode);
  };

  const toggleDark = () => {
    setDarkMode(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, isDark, setTheme, setDarkMode, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
