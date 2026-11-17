export type Role = 'MEMBER' | 'VOLUNTEER' | 'DONOR' | 'ADMIN';

export interface User {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone?: string;
  rtRw?: string;
  avatar?: string;
  role: Role;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  points: number;
  readingTarget: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SafeUser = User & {
  literacyBadge: string;
};

export type AccessMode = 'NON_MEMBER' | 'MEMBER' | 'VOLUNTEER' | 'ADMIN';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  rtRw: string;
}
