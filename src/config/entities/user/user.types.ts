export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  principalType: EPrincipalType;
  role?: EUserRole;
  active?: boolean;
  createdAt: Date;
}

export enum EPrincipalType {
  USER = "USER",
  HEALTH_PROFESSIONAL = "HEALTH_PROFESSIONAL",
}

export enum EUserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
