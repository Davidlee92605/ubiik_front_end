import {createReducer, on} from '@ngrx/store';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {UserInfo} from '@ringo/auth/models';
import {AccountApiActions, AccountPageActions} from '@ringo/accounts/actions';
import {BackendQueryParams} from '@ringo/shared/models/query';
import {BackendError} from '@ringo/core/models';

export interface State {
  error: BackendError | null;
  pending: boolean;

  accounts: UserInfo[];
  accountsTotalRows: number;

  // pagination params
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc' | '';
  query: string;

}

export const initialState: State = {
  error: null,
  pending: false,

  accounts: [],
  accountsTotalRows: 0,


pageIndex: 0,
  pageSize: PageSizeOptions[0],
  sortField: '',
  sortDirection: '',
  query: ''
};

export const reducer = createReducer(
  initialState,
  on(
    AccountPageActions.getUserList,
    AccountPageActions.createAccount,
    AccountPageActions.deleteAccount,
    AccountPageActions.updateAccount,
    (state, result): State => ({
    ...state,
    pending: true,
  })),
  on(AccountPageActions.pageEvent, (state, result): State => ({
    ...state,
    pending: true,
    pageIndex: result.pageEvent.pageIndex,
    pageSize: result.pageEvent.pageSize
  })),
  on(AccountPageActions.sortEvent, (state, result): State => ({
    ...state,
    pending: true,
    sortField: result.sort.active,
    sortDirection: result.sort.direction
  })),
  on(AccountPageActions.searchEvent, (state, result): State => ({
    ...state,
    pending: true,
    query: result.query
  })),
  on(AccountApiActions.accountSearchSuccess, (state, result): State => ({
    ...state,
    pending: false,
    accounts: result.result.accounts,
    accountsTotalRows: result.result.total,
    error: null,
  })),
  on(
    AccountApiActions.accountSearchFailure,
    AccountApiActions.editAccountFailure,
    AccountApiActions.createAccountFailure,
    AccountApiActions.deleteAccountFailure,
    (state, result): State => ({
    ...state,
    pending: false,
    error: result.error,
  })),
  on(
    AccountApiActions.editAccountSuccess,
    AccountApiActions.createAccountSuccess,
    AccountApiActions.deleteAccountSuccess,
    (state, result): State => ({
    ...state,
    pending: false,
    error: null,
  })),
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
export const getAccounts = (state: State) => state.accounts;
export const getAccountsTotalRows = (state: State) => state.accountsTotalRows;

export const getQuery = (state: State): BackendQueryParams => ({
  pageIndex: state.pageIndex,
  pageSize: state.pageSize,
  query: state.query,
  sortDirection: state.sortDirection,
  sortField: state.sortField
});

