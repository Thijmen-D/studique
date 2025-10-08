import { ThemeSelector } from '../theme-selector';
import { useState } from 'react';

export default function ThemeSelectorExample() {
  const [theme, setTheme] = useState<"t1" | "t2" | "t3">("t1");
  
  return (
    <div className="p-4 max-w-md">
      <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
    </div>
  );
}
