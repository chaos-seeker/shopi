import { ReactNode, RefObject, useRef } from 'react';
import { X } from 'lucide-react';
import { useOnClickOutside } from 'usehooks-ts';
import { cn } from '@/utils/cn';

interface IToggleSectionProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isShow: boolean;
  isBackDrop?: boolean;
  className?: string;
}

export function ToggleSection(props: IToggleSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(sectionRef as RefObject<HTMLElement>, () => {
    props.onClose();
  });

  return (
    <div>
      <div
        className={cn('fixed inset-0 z-40 transition-all', {
          show: props.isShow,
          hide: !props.isShow,
          'backdrop-blur-sm bg-black/10': props.isBackDrop,
          hidden: !props.isBackDrop,
        })}
      />
      <div
        ref={sectionRef}
        className={cn('transition-all  relative z-50', props.className, {
          show: props.isShow,
          hide: !props.isShow,
        })}
      >
        <div className="container">
          <div className="rounded-md border bg-white">
            <div className="flex items-center justify-between border-b p-2">
              <p className="text-smp font-bold">{props.title}</p>
              <button
                onClick={props.onClose}
                className="flex size-6 items-center justify-center overflow-hidden rounded-md bg-red"
              >
                <X size={20} className="stroke-white" />
              </button>
            </div>
            <div>{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
