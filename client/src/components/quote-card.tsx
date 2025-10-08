import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  author?: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <Card className="p-6 border-l-4 border-l-accent" data-testid="card-quote">
      <div className="flex gap-4">
        <Quote className="h-6 w-6 text-accent flex-shrink-0" />
        <div>
          <p className="text-foreground italic mb-2" data-testid="text-quote">{quote}</p>
          {author && (
            <p className="text-sm text-muted-foreground">— {author}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
