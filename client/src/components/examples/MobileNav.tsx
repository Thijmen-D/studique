import { MobileNav } from '../mobile-nav';
import { useState } from 'react';

export default function MobileNavExample() {
  const [active, setActive] = useState('dashboard');
  
  return (
    <div className="relative h-screen">
      <div className="p-4 pb-20">
        <p className="text-center text-muted-foreground">Current: {active}</p>
      </div>
      <MobileNav active={active} onNavigate={setActive} />
    </div>
  );
}
