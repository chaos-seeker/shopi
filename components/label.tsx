import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface ILabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function Label({ children, htmlFor, className }: ILabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-2 block text-sm font-medium text-gray-700',
        className,
      )}
    >
      {children}
    </label>
  );
}

