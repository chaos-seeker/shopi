import { cn } from '@/utils/cn';
import { forwardRef, InputHTMLAttributes } from 'react';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          spellCheck={false}
          className={cn(
            'w-full truncate font-medium rounded-md border p-[9px] border-gray-200 text-slate-500 bg-white text-smp placeholder:text-sm focus:border-red transition-colors',
            {
              'border-red-500': error,
            },
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
