import {
  createSelector,
  createFeatureSelector,
  Action,
  combineReducers,
} from '@ngrx/store';
import * as fromRoot from '@ringo/reducers';
import * as fromAuth from '@ringo/auth/reducers/auth.reducer';
import * as fromLoginPage from '@ringo/auth/reducers/login-page.reducer';
import * as fromChangePasswordPage from '@ringo/auth/reducers/change-password-page.reducer';
import * as fromLostPasswordPage from '@ringo/auth/reducers/lost-password-page.reducer';
import * as fromHandleResetLinkPage from '@ringo/auth/reducers/handle-reset-link-page.reducer';


export interface AuthState {
  status: fromAuth.State;
  loginPage: fromLoginPage.State;
  changePasswordPage: fromChangePasswordPage.State;
  lostPasswordPage: fromLostPasswordPage.State;
  handleResetLinkPage: fromHandleResetLinkPage.State;
}

export interface State extends fromRoot.State {
  auth: AuthState;
}

export function reducers(state: AuthState | undefined, action: Action) {
  return combineReducers({
    status: fromAuth.reducer,
    loginPage: fromLoginPage.reducer,
    changePasswordPage: fromChangePasswordPage.reducer,
    lostPasswordPage: fromLostPasswordPage.reducer,
    handleResetLinkPage: fromHandleResetLinkPage.reducer
  })(state, action);
}

export const selectAuthState = createFeatureSelector<State, AuthState>('auth');

export const selectAuthStatusState = createSelector(
  selectAuthState,
  (state: AuthState) => state.status
);
export const getUserInfo = createSelector(selectAuthStatusState, fromAuth.getUserInfo);
export const getToken = createSelector(selectAuthStatusState, fromAuth.getToken);
export const getLoggedIn = createSelector(getUserInfo, user => !!user);

export const selectLoginPageState = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginPage
);
export const getLoginPageError = createSelector(
  selectLoginPageState,
  fromLoginPage.getError
);
export const getLoginPagePending = createSelector(
  selectLoginPageState,
  fromLoginPage.getPending
);

export const selectChangePasswordPageState = createSelector(
  selectAuthState,
  (state: AuthState) => state.changePasswordPage
);
export const getChangePasswordPageError = createSelector(
  selectChangePasswordPageState,
  fromChangePasswordPage.getError
);
export const getChangePasswordPagePending = createSelector(
  selectChangePasswordPageState,
  fromChangePasswordPage.getPending
);

export const selectLostPasswordPageState = createSelector(
  selectAuthState,
  (state: AuthState) => state.lostPasswordPage
);
export const getLostPasswordPageError = createSelector(
  selectLostPasswordPageState,
  fromLostPasswordPage.getError
);
export const getLostPasswordPagePending = createSelector(
  selectLostPasswordPageState,
  fromLostPasswordPage.getPending
);

export const selectHandleResetLinkPageState = createSelector(
  selectAuthState,
  (state: AuthState) => state.handleResetLinkPage
);
export const getHandleResetLinkPageError = createSelector(
  selectHandleResetLinkPageState,
  fromHandleResetLinkPage.getError
);
export const getHandleResetLinkPagePending = createSelector(
  selectHandleResetLinkPageState,
  fromHandleResetLinkPage.getPending
);
