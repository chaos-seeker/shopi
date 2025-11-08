'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const Bprogress = (props: PropsWithChildren) => {
  return (
    <ProgressProvider
      height="4px"
      color="#ed1943"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {props.children}
    </ProgressProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const ReactQuery = (props: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

const Nuqs = (props: PropsWithChildren) => {
  return <NuqsAdapter>{props.children}</NuqsAdapter>;
};

const HotToast = () => {
  return <Toaster position="top-center" containerClassName="toaster-wrapper" />;
};

export const Providers = (props: PropsWithChildren) => {
  return (
    <>
      <Bprogress>
        <ReactQuery>
          <Nuqs>
            <Suspense>
              <HotToast />
              {props.children}
            </Suspense>
          </Nuqs>
        </ReactQuery>
      </Bprogress>
    </>
  );
};
