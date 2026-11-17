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
}

export type SafeUser = User & {
  literacyBadge: string;
};
