import { useQueryState } from 'nuqs';

export function useToggleUrlState(key: string) {
  const prefixedKey = `toggle-${key}`;
  const [state, setState] = useQueryState(prefixedKey);

  const updateUrl = (
    newState: boolean,
    additionalParams?: Record<string, string>,
    keysToRemove?: string[],
  ) => {
    const updatedParams: Record<string, string | null> = {};
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([paramKey, value]) => {
        updatedParams[paramKey] = value;
      });
    }
    updatedParams[prefixedKey] = newState ? 'true' : null;
    keysToRemove?.forEach((key) => {
      updatedParams[key] = null;
    });
    setState(newState ? 'true' : null, { shallow: true });
  };

  return {
    isShow: state === 'true',
    toggle: () => updateUrl(state !== 'true'),
    hide: (keysToRemove?: string[]) =>
      updateUrl(false, undefined, keysToRemove),
    show: (additionalParams?: Record<string, string>) =>
      updateUrl(true, additionalParams),
  };
}
