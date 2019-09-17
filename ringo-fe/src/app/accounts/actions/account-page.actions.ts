import {createAction, props} from '@ngrx/store';
import {PageEvent, Sort} from '@angular/material';
import {UserInfo} from '@ringo/auth/models/user';

export const searchEvent = createAction(
  '[AccountPage] Search Event',
  props<{ query: string }>()
);

export const sortEvent = createAction(
  '[AccountPage] Sort Event',
  props<{ sort: Sort }>()
);

export const pageEvent = createAction(
  '[AccountPage] Page Event',
  props<{ pageEvent: PageEvent }>()
);

export const getUserList = createAction(
  '[AccountPage] Get User List'
);

export const updateAccount = createAction(
  '[AccountPage] Update Account Details',
  props<{account: UserInfo}>()
);

export const createAccount = createAction(
  '[AccountPage] Create Account',
  props<{account: UserInfo}>()
);

export const deleteAccount = createAction(
  '[AccountPage] Delete Account',
  props<{accountId: number}>()
);
