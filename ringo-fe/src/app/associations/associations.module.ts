import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@ringo/shared';
import {AssociationsRoutingModule} from '@ringo/associations/associations-routing.module';
import { AccountListComponent } from './components/account-list.component';
import { MeterAssociationsComponent } from './components/meter-associations.component';
import {AssociationsPageComponent} from '@ringo/associations/containers/associations-page.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from '@ringo/associations/reducers';
import {EffectsModule} from '@ngrx/effects';
import {AssociationsEffects} from '@ringo/associations/effects/associations.effects';
import {FormsModule} from '@angular/forms';
import {MetersModule} from '@ringo/meters';
import { AssociateMeterDialogComponent } from './dialogs/associate-meter.dialog.component';

@NgModule({
  declarations: [
    AccountListComponent,
    MeterAssociationsComponent,
    AssociationsPageComponent,
    AssociateMeterDialogComponent
  ],
  entryComponents: [
    AssociateMeterDialogComponent
  ],
  exports: [
    AssociationsPageComponent,
    AccountListComponent,
    MeterAssociationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssociationsRoutingModule,
    StoreModule.forFeature('association', reducers),
    EffectsModule.forFeature([AssociationsEffects]),
    FormsModule,
    MetersModule,
  ]
})
export class AssociationsModule { }
