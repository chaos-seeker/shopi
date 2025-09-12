import { useEffect, useState } from 'react';

export function useShuffledArray<T>(data: T[]): T[] {
  const [shuffledArray, setShuffledArray] = useState<T[]>([]);
  const shuffleArray = (array: T[]): T[] => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
    setShuffledArray(shuffleArray(data));
  }, [data]);

  return shuffledArray;
}
