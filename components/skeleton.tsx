import { cn } from '@/utils/cn';

interface ISkeletonProps {
  className?: string;
}

export function Skeleton({ className }: ISkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className,
      )}
    />
  );
}

