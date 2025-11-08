import { TUser } from '@/types/user';
import { slice } from 'killua';

export const userSlice = slice({
  key: 'user',
  defaultClient: null as TUser | null,
  defaultServer: null,
  selectors: {
    isLoggedIn: (value) => Boolean(value),
  },
  reducers: {
    logout: () => null,
  },
});
