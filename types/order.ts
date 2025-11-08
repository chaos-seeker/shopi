import { TUser } from './user';

export type TOrder = {
  id: number;
  user: TUser;
  original_amount: number;
  discount: number;
  amount: number;
  created_at: string;
  updated_at: string;
};
