import {Meter} from '@ringo/meters/models';
import {UserInfo} from '@ringo/auth/models';

export interface Manager {
  meters: Meter[];
  user: UserInfo;
}

export interface ManagerSearchResult {
  accounts: Manager[];
  total: number;
}

export function isManagerSearchResult(obj: any): obj is Manager[] {
  if (obj[0].hasOwnProperty('meters')) {
    return true;
  } else if (obj.length === 0) {
    return true;
  } else {
    return false;
  }
}

