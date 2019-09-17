import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeterPageComponent} from '@ringo/meters/containers/meter-page.component';

const routes: Routes = [
  {path: '', component: MeterPageComponent, data: {title: 'Meters'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetersRoutingModule {
}
