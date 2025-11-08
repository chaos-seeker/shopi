import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className: string;
}

export function Modal(props: IModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`flex w-full ${props.className} max-h-[90vh] flex-col rounded-lg bg-white overflow-hidden`}
      >
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
          <h2 className="font-bold text-gray-900">{props.title}</h2>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {props.children}
        </div>

        {props.footer && (
          <div className="flex shrink-0 gap-2 border-t p-4">{props.footer}</div>
        )}
      </div>
    </div>
  );
}
