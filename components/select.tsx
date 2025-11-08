'use client';

import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface ISelectOption {
  value: string | number;
  label: string;
}

interface ISelectProps {
  error?: string;
  options: ISelectOption[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLDivElement, ISelectProps>(
  (
    {
      error,
      options,
      placeholder,
      value,
      onChange,
      className,
      disabled = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
      } else {
        const timer = setTimeout(() => setIsVisible(false), 200);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (optionValue: string | number) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div className="flex flex-col gap-2">
        <div ref={containerRef} className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'flex w-full items-center justify-between truncate rounded-md border p-[9px] border-gray-200 text-slate-500 bg-white text-sm font-medium focus:border-red transition-colors',
              {
                'border-red-500': error,
                'cursor-not-allowed opacity-50': disabled,
                'cursor-pointer': !disabled,
              },
              className,
            )}
          >
            <span
              className={cn('truncate', {
                'text-gray-400': !selectedOption && placeholder,
              })}
            >
              {selectedOption
                ? selectedOption.label
                : placeholder || 'انتخاب کنید'}
            </span>
            <ChevronDown
              size={16}
              className={cn('shrink-0 transition-transform duration-200', {
                'rotate-180': isOpen,
              })}
            />
          </button>

          {isVisible && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg',
                'transition-all duration-200',
                {
                  'opacity-100 translate-y-0': isOpen,
                  'opacity-0 -translate-y-2 pointer-events-none': !isOpen,
                },
              )}
            >
              <div className="max-h-60 overflow-y-auto">
                {options.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    گزینه‌ای وجود ندارد
                  </div>
                ) : (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full px-4 py-2 text-right text-sm text-slate-500 hover:bg-gray-50 transition-colors',
                        {
                          'bg-red/10 text-red font-medium':
                            option.value === value,
                        },
                      )}
                    >
                      {option.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
