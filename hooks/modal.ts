'use client';

import { useQueryState } from 'nuqs';

type Return = {
  isShow: boolean;
  show: () => void;
  hide: (keys?: string[]) => void;
};

const querySetters: Record<string, (val: string) => void> = {};

function useRegisterQuerySetter(key: string, setter: (val: string) => void) {
  querySetters[key] = setter;
}

export function useModal(key: string): Return {
  const prefixedKey = `modal-${key}`;
  const [state, setState] = useQueryState(prefixedKey, {
    defaultValue: '',
  });

  useRegisterQuerySetter(prefixedKey, setState);

  const hide = (keys?: string[]) => {
    if (keys && keys.length > 0) {
      keys.forEach((k) => {
        const setter = querySetters[`modal-${k}`];
        if (setter) setter('');
      });
    } else {
      setState('');
    }
  };

  return {
    isShow: state === 'show',
    show: () => setState('show'),
    hide,
  };
}
