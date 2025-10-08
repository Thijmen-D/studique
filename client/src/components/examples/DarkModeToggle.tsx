import { DarkModeToggle } from '../dark-mode-toggle';
import { useState } from 'react';

export default function DarkModeToggleExample() {
  const [mode, setMode] = useState<"light" | "dark" | "auto">("auto");
  const [isDark, setIsDark] = useState(false);
  
  return (
    <div className="p-4 max-w-md">
      <DarkModeToggle mode={mode} isDark={isDark} onModeChange={setMode} />
    </div>
  );
}
