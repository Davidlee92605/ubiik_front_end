import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ChangePasswordPageComponent,
  HandleResetLinkPageComponent,
  LoginPageComponent,
  LostPasswordLinkSentComponent,
  LostPasswordPageComponent,
  PasswordChangedComponent
} from '@ringo/auth/containers';
import {AuthRoutingModule} from '@ringo/auth/auth-routing.module';
import {SharedModule} from '@ringo/shared';
import {
  ChangePasswordFormComponent,
  HandleResetLinkFormComponent,
  LoginFormComponent,
  LostPasswordFormComponent
} from '@ringo/auth/components';
import { ConfirmLogoutDialogComponent } from './components/confirm-logout-dialog.component';
import {AuthEffects} from '@ringo/auth/effects';
import {reducers} from '@ringo/auth/reducers';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';


@NgModule({
  declarations: [LoginFormComponent,
    LoginPageComponent,
    ChangePasswordPageComponent,
    ChangePasswordFormComponent,
    HandleResetLinkPageComponent,
    HandleResetLinkFormComponent,
    LostPasswordPageComponent,
    LostPasswordFormComponent,
    LostPasswordLinkSentComponent,
    PasswordChangedComponent,
    ConfirmLogoutDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
  entryComponents: [
    ConfirmLogoutDialogComponent
  ]
})
export class AuthModule {
}
