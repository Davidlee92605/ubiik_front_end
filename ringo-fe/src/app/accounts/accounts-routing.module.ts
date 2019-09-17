import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountPageComponent} from '@ringo/accounts/containers/account-page.component';

const routes: Routes = [
  {path: '', component: AccountPageComponent, data: {title: 'Accounts'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
