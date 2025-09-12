import Link from 'next/link';
import { HiChevronLeft } from 'react-icons/hi2';

interface IBreadCrumbProps {
  title: string;
  link?: Record<'text' | 'path', string>;
}

export function BreadCrumb(props: IBreadCrumbProps) {
  return (
    <div className="flex h-fit items-center gap-1">
      <Link
        href="/"
        className="text-sm font-medium text-gray-500 transition-all hover:text-green"
      >
        خانه
      </Link>
      {props.link ? (
        <>
          <HiChevronLeft className="fill-gray-500 text-sm" />
          <Link
            href={props.link.path}
            className="text-sm font-medium text-gray-500 transition-all hover:text-green"
          >
            {props.link.text}
          </Link>
        </>
      ) : null}
      <HiChevronLeft className="fill-gray-500 text-sm" />
      <p className="text-sm font-medium text-gray-500">{props.title}</p>
    </div>
  );
}
