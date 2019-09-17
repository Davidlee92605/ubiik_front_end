import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  ChangePasswordPageComponent,
  HandleResetLinkPageComponent,
  LoginPageComponent,
  LostPasswordLinkSentComponent, LostPasswordPageComponent, PasswordChangedComponent
} from '@ringo/auth/containers';
import {AuthGuard} from '@ringo/auth/services';


const routes: Routes = [
  {path: 'login', component: LoginPageComponent, data: {title: 'Login'}},
  {path: 'change-password', component: ChangePasswordPageComponent, canActivate: [AuthGuard],
    data: {role: 'any', title: 'Change Password'}},
  {path: 'lost-password', component: LostPasswordPageComponent, data: {title: 'Lost Password'}},
  {path: 'handle-reset-link', component: HandleResetLinkPageComponent, data: {title: 'Reset Password'}},
  {path: 'password-changed', component: PasswordChangedComponent, data: {title: 'Password Changed'}},
  {path: 'lost-password-link-sent', component: LostPasswordLinkSentComponent, data: {title: 'Link Sent'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
