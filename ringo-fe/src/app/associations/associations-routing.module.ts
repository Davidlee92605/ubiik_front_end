import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AssociationsPageComponent} from '@ringo/associations/containers/associations-page.component';

const routes: Routes = [
  {path: '', component: AssociationsPageComponent, data: {title: 'Meter Associations'}},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AssociationsRoutingModule { }
