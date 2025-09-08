export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: number;
  createdAt: string;
  terminatedAt: string | null;
};
