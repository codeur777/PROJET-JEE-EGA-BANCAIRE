export interface User {
  id?: number;
  email: string;
  password?: string;
  role?: string;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}