'use client';

import { cn } from '@/utils/cn';
import Image from 'next/image';
import {
  forwardRef,
  InputHTMLAttributes,
  useState,
  useRef,
  useEffect,
} from 'react';
import { X } from 'lucide-react';

interface IInputImageProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  error?: string;
  onChange?: (file: File | null) => void;
  preview?: string | null;
}

export const InputImage = forwardRef<HTMLInputElement, IInputImageProps>(
  ({ className, error, onChange, preview: initialPreview, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(
      initialPreview || null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setPreview(initialPreview || null);
    }, [initialPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange?.(file);
      } else {
        setPreview(null);
        onChange?.(null);
      }
    };

    const handleRemove = () => {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onChange?.(null);
    };

    return (
      <div className="flex flex-col gap-2">
        {preview ? (
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-gray-200">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 left-2 rounded-md bg-red p-1.5"
            >
              <X size={16} className="stroke-white" />
            </button>
          </div>
        ) : (
          <label
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50 p-8 transition-colors hover:border-red',
              {
                'border-red-500': error,
              },
              className,
            )}
          >
            <input
              ref={(node) => {
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                fileInputRef.current = node;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              {...props}
            />
            <p className="text-sm font-medium text-gray-600">
              کلیک کنید یا تصویر را بکشید
            </p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF تا 10MB</p>
          </label>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

InputImage.displayName = 'InputImage';
