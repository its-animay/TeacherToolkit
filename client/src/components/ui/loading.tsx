import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn("bg-card rounded-lg p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-full skeleton" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded skeleton" />
          <div className="h-3 bg-muted rounded w-3/4 skeleton" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded skeleton" />
        <div className="h-3 bg-muted rounded w-5/6 skeleton" />
      </div>
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export function LoadingTable({ rows = 5, columns = 6 }: LoadingTableProps) {
  return (
    <div className="rounded-md border">
      <div className="p-4 border-b">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded skeleton" />
          ))}
        </div>
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 border-b last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, j) => (
              <div key={j} className="h-4 bg-muted rounded skeleton" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
