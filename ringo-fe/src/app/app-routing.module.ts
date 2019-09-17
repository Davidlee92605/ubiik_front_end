import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundPageComponent} from '@ringo/core/containers/not-found-page.component';
import {AuthGuard} from '@ringo/auth/services';


const routes: Routes = [
  { path: '', redirectTo: '/meters', pathMatch: 'full' },
  {
    path: 'meters',
    loadChildren: () => import('./meters/meters.module').then(m => m.MetersModule),
    canActivate: [AuthGuard],
    data: {role: ['manager', 'admin']}
  },
  {
    path: 'load-profile',
    loadChildren: () => import('./load-profile/load-profile.module').then(m => m.LoadProfileModule),
    canActivate: [AuthGuard],
    data: {role: ['manager', 'admin']}
  },
  {
    path: 'alerts',
    loadChildren: () => import('./alerts/alerts.module').then(m => m.AlertsModule),
    canActivate: [AuthGuard],
    data: {role: ['manager', 'admin']}
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthGuard],
    data: {role: ['root']}
  },
  {
    path: 'meter-associations',
    loadChildren: () => import('./associations/associations.module').then(m => m.AssociationsModule),
    canActivate: [AuthGuard],
    data: {role: ['root']}
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { title: 'Not found' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
