import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTableComponent } from './components/account-table.component';
import { AccountPageComponent } from './containers/account-page.component';
import {SharedModule} from '@ringo/shared';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducers} from '@ringo/accounts/reducers';
import {AccountEffects} from '@ringo/accounts/effects';
import {AccountDialogComponent} from '@ringo/accounts/dialogs/account-dialog.component';
import {AccountsRoutingModule} from '@ringo/accounts/accounts-routing.module';

@NgModule({
  declarations: [
    AccountTableComponent,
    AccountPageComponent,
    AccountDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccountsRoutingModule,

    StoreModule.forFeature('account', reducers),
    EffectsModule.forFeature([AccountEffects]),
  ],
  entryComponents: [
    AccountDialogComponent
  ]
})
export class AccountsModule { }
