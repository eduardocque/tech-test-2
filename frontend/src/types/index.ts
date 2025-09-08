export type User = {
  id: number;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive';
  logins: number;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: number;
  userId: number;
  createdAt: string;
  terminatedAt: string | null;
};
