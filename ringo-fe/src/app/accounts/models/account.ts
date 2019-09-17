import {UserInfo} from '@ringo/auth/models';

export interface AccountSearchResult {
  accounts: UserInfo[];
  total: number;
}

export function isAccountSearchResult(obj: any): obj is AccountSearchResult {
  return obj.hasOwnProperty('accounts');
}
