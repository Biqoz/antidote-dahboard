import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  count?: number;
  className?: string;
}

export function LoadingState({ count = 3, className = "h-40" }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}