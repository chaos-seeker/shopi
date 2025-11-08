import { TUser } from './user';

export type TOrder = {
  id: number;
  user: TUser;
  amount: number;
  discount: number;
  created_at: string;
  updated_at: string;
};
