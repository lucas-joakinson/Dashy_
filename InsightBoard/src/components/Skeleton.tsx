import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-white/5 border border-white/5 rounded-2xl",
            className
          )}
        />
      ))}
    </>
  );
}
