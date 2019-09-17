import {Role} from '@ringo/core/models';


export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface PasswordResetRequest {
  token: string;
  password: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
}

export interface PasswordChangeResponse {
  changed: boolean;
  message: string;
}
