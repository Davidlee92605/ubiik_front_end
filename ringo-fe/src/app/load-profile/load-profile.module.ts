import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadProfileRoutingModule } from './load-profile-routing.module';
import { LoadProfilePageComponent } from './containers/load-profile-page.component';
import { LoadProfileSearchComponent } from './components/load-profile-search.component';
import { LoadProfileTableComponent } from './components/load-profile-table.component';
import { LoadProfileExportComponent } from './components/load-profile-export.component';
import { LoadProfileChartComponent } from './components/load-profile-chart.component';

import {SharedModule} from '@ringo/shared';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {LoadProfileEffects} from '@ringo/load-profile/effects';
import {reducers} from '@ringo/load-profile/reducers';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    LoadProfilePageComponent,
    LoadProfileSearchComponent,
    LoadProfileTableComponent,
    LoadProfileExportComponent,
    LoadProfileChartComponent
  ],
  imports: [
    CommonModule,
    LoadProfileRoutingModule,
    SharedModule,
    StoreModule.forFeature('loadProfile', reducers),
    EffectsModule.forFeature([LoadProfileEffects]),
    FormsModule,
  ]
})
export class LoadProfileModule { }
