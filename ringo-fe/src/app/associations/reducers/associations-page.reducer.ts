import {createReducer, on} from '@ngrx/store';
import {BackendError} from '@ringo/core/models';
import {AssociationsApiActions, AssociationsPageActions} from '@ringo/associations/actions';
import {BackendQueryParams} from '@ringo/shared/models/query';
import {PageSizeOptions} from '@ringo/shared/functions/paging';
import {Manager} from '@ringo/associations/models/associations';
import {Meter} from '@ringo/meters/models';
import {filterArray} from '@ringo/meters/reducers/meter-page.reducer';

export interface State {
  error: BackendError | null;
  pending: boolean;

  accounts: Manager[];
  accountsTotalRows: number;
  selectedUser: Manager[];
  userMeters: Meter[] | null;
  userMetersLength: number;
  userIsSelected: boolean;

  meterSearchPageIndex: number;
  meterSearchPageSize: number;
  meterSearchSortField: string;
  meterSearchSortDirection: 'asc' | 'desc' | '';
  meterSearchQuery: string;

  meterSearchResults: Meter[];
  meterSearchResultsSize: number;

  selectedMeters: Meter[];
  meterIsSelected: boolean;

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
  selectedUser: [],
  userMeters: [],
  userMetersLength: 0,
  userIsSelected: false,

  meterSearchPageIndex: 0,
  meterSearchPageSize: 0,
  meterSearchSortField: '',
  meterSearchSortDirection: '',
  meterSearchQuery: '',

  meterSearchResults: [],
  meterSearchResultsSize: 0,

  selectedMeters: [],
  meterIsSelected: false,

  pageIndex: 0,
  pageSize: PageSizeOptions[0],
  sortField: '',
  sortDirection: '',
  query: ''
};

// @ts-ignore
// @ts-ignore
export const reducer = createReducer(
  initialState,
  on(AssociationsPageActions.pageEvent, (state, result): State => ({
    ...state,
    pending: true,
    pageIndex: result.pageEvent.pageIndex,
    pageSize: result.pageEvent.pageSize
  })),
  on(AssociationsPageActions.openDialog, (state) => ({
    ...state,
    pending: true,
    selectedMeters: [],
  })),
  on(AssociationsPageActions.closeDialog, (state) => ({
    ...state,
    meterSearchQuery: '',
    meterSearchResults: [],
    meterSearchResultsSize: 0,
    selectedMeters: [],
  })),
  on(AssociationsPageActions.dialogPageEvent, (state, result): State => ({
    ...state,
    pending: true,
    meterSearchPageIndex: result.dialogPageEvent.pageIndex,
    meterSearchPageSize: result.dialogPageEvent.pageSize
  })),
  on(AssociationsPageActions.sort, (state, result): State => ({
    ...state,
    pending: true,
    sortField: result.sort.active,
    sortDirection: result.sort.direction
  })),
  on(AssociationsPageActions.getAccountsList, (state, result): State => ({
    ...state,
    pending: true
  })),
  on(AssociationsApiActions.accountSearchSuccess, (state, result): State => ({
    ...state,
    pending: false,
    accounts: result.result,
    accountsTotalRows: result.result.length,
    error: null,
    selectedUser: [],
    userIsSelected: false,
    userMeters: [],
    userMetersLength: 0
  })),
  on(AssociationsPageActions.selectUser, (state, result): State => {
    let userMetersLength = state.userMetersLength;
    if (result.user[0].meters === null) {
      userMetersLength = 0;
    } else {
      userMetersLength = result.user[0].meters.length;
    }
    return {
      ...state,
      pending: false,
      selectedUser: result.user,
      userMeters: result.user[0].meters,
      userMetersLength: userMetersLength,
      userIsSelected: true,
    };
  }),
  on(AssociationsPageActions.deselectUser, (state, result): State => ({
    ...state,
    selectedUser: [],
    userMeters: [],
    userMetersLength: 0,
    userIsSelected: false,
    selectedMeters: [],
    meterIsSelected: false,
  })),
  on(AssociationsPageActions.searchMeters, (state, result): State => ({
    ...state,
    pending: true,
      // not sure why it only works with .search
    meterSearchQuery: result.query,
})),
  on(AssociationsApiActions.meterSearchSuccess, (state, result): State => ({
    ...state,
    pending: false,
    meterSearchResults: result.result.meters,
    meterSearchResultsSize: result.result.size,
  })),
  on(AssociationsPageActions.selectMetersDialog, (state, result): State => ({
    ...state,
    selectedMeters: result.meters,
    meterIsSelected: true,
  })),
  on(AssociationsPageActions.selectMetersTable, (state, result): State => {
    const meters = result.checked ? [...state.selectedMeters, result.meter] : filterArray(state.selectedMeters, result.meter);
    if (meters.length !== 0) {
      return {
        ...state,
        selectedMeters: meters,
        meterIsSelected: true
      };
    } else {
      return {
        ...state,
        selectedMeters: meters,
        meterIsSelected: false
      };
    }
  }),
  on(AssociationsPageActions.associateMeters, AssociationsPageActions.dissociateMeters, (state, result): State => ({
    ...state,
    pending: true
  })),
  on(AssociationsApiActions.associateMetersSuccess, AssociationsApiActions.dissociateMetersSuccess, (state, result): State => ({
    ...state,
    pending: false,

  }))
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
export const getAccounts = (state: State) => state.accounts;
export const getAccountsTotalRows = (state: State) => state.accountsTotalRows;
export const getSelectedUser = (state: State) => state.selectedUser;
export const getSelectedUserMeters = (state: State) => state.userMeters;
export const getSelectedUserMetersLength = (state: State) => state.userMetersLength;
export const getIsSelected = (state: State) => state.userIsSelected;
export const getMeterSearchResults = (state: State) => state.meterSearchResults;
export const getMeterSearchResultsSize = (state: State) => state.meterSearchResultsSize;
export const getSelectedMeters = (state: State) => state.selectedMeters;
export const getMeterIsSelected = (state: State) => state.meterIsSelected;
export const getMeterSearchQuery = (state: State): BackendQueryParams => ({
  pageIndex: state.meterSearchPageIndex,
  pageSize: state.meterSearchPageSize,
  query: state.meterSearchQuery,
  sortDirection: state.meterSearchSortDirection,
  sortField: state.meterSearchSortField
});
export const getQuery = (state: State): BackendQueryParams => ({
  pageIndex: state.pageIndex,
  pageSize: state.pageSize,
  query: state.query,
  sortDirection: state.sortDirection,
  sortField: state.sortField
});

