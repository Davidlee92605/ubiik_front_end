import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MetersRoutingModule} from './meters-routing.module';
import {MeterTableComponent} from './components/meter-table.component';
import {MeterPageComponent} from './containers/meter-page.component';
import {MeterSearchBarComponent} from './components/meter-search-bar.component';
import {MeterToolBarComponent} from './components/meter-tool-bar.component';
import {MeterImportBarComponent} from './components/meter-import-bar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '@ringo/shared';
import {EditMeterDialogComponent} from '@ringo/meters/dialogs/edit-meter-dialog.component';
import {MeterInfoDialogComponent} from '@ringo/meters/dialogs/meter-info-dialog.component';
import {MeterImportFormComponent} from './components/meter-import-form.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {MeterEffects} from '@ringo/meters/effects/meter.effects';
import {reducers} from '@ringo/meters/reducers';
import {ATCommandDialogComponent} from '@ringo/meters/dialogs/at-command-dialog.component';
import {QueryMeterDialogComponent} from '@ringo/meters/dialogs/query-meter-dialog.component';
import {MeterImportDialogComponent} from '@ringo/meters/dialogs/meter-import-dialog.component';

@NgModule({
  declarations: [
    MeterTableComponent,
    MeterPageComponent,
    MeterSearchBarComponent,
    MeterToolBarComponent,
    MeterImportBarComponent,
    EditMeterDialogComponent,
    MeterInfoDialogComponent,
    MeterImportFormComponent,
    QueryMeterDialogComponent,
    ATCommandDialogComponent,
    MeterImportDialogComponent,
  ],
  entryComponents: [
    EditMeterDialogComponent,
    MeterInfoDialogComponent,
    QueryMeterDialogComponent,
    ATCommandDialogComponent,
    MeterImportDialogComponent,
  ],
  exports: [
    MeterTableComponent
  ],
  imports: [
    CommonModule,
    MetersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('meter', reducers),
    EffectsModule.forFeature([MeterEffects]),
  ]
})
export class MetersModule {
}
