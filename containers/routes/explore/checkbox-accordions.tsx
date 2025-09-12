'use client';

import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { HiCheck, HiChevronDown } from 'react-icons/hi2';
import { ToggleSection } from '@/components/toggle-section';
import { useToggleUrlState } from '@/hooks/toggle-url-state';
import { cn } from '@/utils/cn';

export function CheckboxAccordions() {
  const filterToggleUrlState = useToggleUrlState('filter');


  return (
    <div className="lg:relative">
      <div className="sticky top-3 flex  flex-col gap-3 overflow-y-auto">
        {/* desktop */}
          <div className="hidden min-w-64 lg:block">
            <div className="flex flex-col gap-3">
              <CheckboxsAccordion
              />
            </div>
          </div>
      </div>
      {/* mobile */}
      <ToggleSection
        title="فیلتر"
        isShow={filterToggleUrlState.isShow}
        onClose={() => filterToggleUrlState.hide()}
        className="absolute left-0 top-0 z-50 w-screen"
      >
        <div className="flex flex-col gap-2.5 p-2.5">
            <div className="flex flex-col gap-3">
              <CheckboxsAccordion
              />
            </div>
        </div>
      </ToggleSection>
    </div>
  );
}

const CheckboxsAccordion = () => {
  const brandsData = [
    { text: 'اپل', id: 1, query: 'brand' },
    { text: 'سامسونگ', id: 2, query: 'brand' },
    { text: 'هواوی', id: 3, query: 'brand' },
  ];
  const [isShow, setIsShow] = useState(true);

  return (
    <section className="rounded-lg border lg:rounded-xl">
      {/* head */}
      <button
        onClick={() => setIsShow((prev) => !prev)}
        className="flex w-full items-center justify-between p-2.5 text-smp font-medium"
      >
        <p className="text-sm text-gray-600 lg:text-smp">برند</p>
        <HiChevronDown
          size={18}
          className={cn('transition-all', {
            'rotate-180': isShow,
          })}
        />
      </button>
      {/* body */}
      <div
        className={cn('h-0 opacity-0 transition-all overflow-hidden', {
          'h-auto opacity-100': isShow,
        })}
      >
        <div className="flex flex-col gap-1.5 border-t p-2.5">
          {brandsData.map((item) => (
            <CheckboxItem key={item.id} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ICheckboxItemProps {
  data: {
    text: string;
    id: number;
    query: string;
  };
}

const CheckboxItem = (props: ICheckboxItemProps) => {
  const searchParams = useSearchParams();
  const queryWithPrefix = `filter-${props.data.query}`;
  const [isChecked, setIsChecked] = useState(false);
  const [, setNuqsStateFilter] = useQueryState(queryWithPrefix);

  useEffect(() => {
    const paramValues =
      searchParams.get(queryWithPrefix)?.split(',').map(Number) || [];
    setIsChecked(paramValues.includes(props.data.id));
  }, [searchParams, queryWithPrefix, props.data.id]);

  const handleCheck = () => {
    setIsChecked((prev) => !prev);
    setNuqsStateFilter((prev) => {
      if (isChecked) {
        const updated = (prev ?? '')
          .split(',')
          .filter((id) => id && id !== props.data.id.toString());
        return updated.length ? updated.join(',') : null;
      } else {
        return prev ? `${prev},${props.data.id}` : props.data.id.toString();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCheck}
        className={cn(
          'size-[18px] rounded-md border transition-all border-gray-200 bg-gray flex items-center justify-center',
          { 'bg-green': isChecked },
        )}
      >
        {isChecked ? <HiCheck className="fill-white p-0.5" /> : null}
      </button>
      <p className="text-xsp text-gray-600 lg:text-smp">{props.data.text}</p>
    </div>
  );
};
