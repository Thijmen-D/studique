import { QuoteCard } from '../quote-card';

export default function QuoteCardExample() {
  return (
    <div className="p-4">
      <QuoteCard 
        quote="Success is the sum of small efforts repeated day in and day out."
        author="Robert Collier"
      />
    </div>
  );
}
