'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface FiltersLoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const FiltersLoadingContext = createContext<
  FiltersLoadingContextType | undefined
>(undefined);

export function FiltersLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FiltersLoadingContext.Provider
      value={{ isLoading, setLoading: setIsLoading }}
    >
      {children}
    </FiltersLoadingContext.Provider>
  );
}

export function useFiltersLoading() {
  const context = useContext(FiltersLoadingContext);
  if (context === undefined) {
    throw new Error(
      'useFiltersLoading must be used within FiltersLoadingProvider',
    );
  }
  return context;
}
