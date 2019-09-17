import {createReducer, on} from '@ngrx/store';
import {AuthActions, AuthApiActions} from '@ringo/auth/actions';
import {UserInfo} from '@ringo/auth/models';
import * as jwt_decode from 'jwt-decode';
import {str2role} from '@ringo/core/models';

export interface State {
  userInfo: UserInfo | null;
  token: string | null;
}

export const initialState: State = createInitialState();

const emptyState: State = {
  userInfo: null,
  token: null,
};

function createInitialState(): State {
  const toke = localStorage.getItem('uh-token');
  if (toke) {
    // ugh, had to copy paste here, parseToken() isn't available this early for some reason
    const decoded: { id: number; name: string; email: string; role: string; exp: number } = jwt_decode(toke);
    const ui = {...decoded, role: str2role(decoded.role)};
    return {userInfo: ui, token: toke};
  } else {
    return {
      userInfo: null,
      token: null,
    };
  }
}

export const reducer = createReducer(
  initialState,
  on(AuthApiActions.parsedUserInfo, (state, { userInfo }) => ({ ...state, userInfo })),
  on(AuthApiActions.recievedToken, (state, { token }) => ({...state, token})),
  on(AuthActions.logout, () => ({...emptyState}))
);

export const getUserInfo = (state: State) => state.userInfo;
export const getToken = (state: State) => state.token;
