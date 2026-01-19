export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}