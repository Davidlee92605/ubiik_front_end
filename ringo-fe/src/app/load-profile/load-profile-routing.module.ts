import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoadProfilePageComponent} from '@ringo/load-profile/containers/load-profile-page.component';

const routes: Routes = [
  {path: '', component: LoadProfilePageComponent, data: {title: 'Load Profile'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadProfileRoutingModule { }
