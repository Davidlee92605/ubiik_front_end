import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NotFoundPageComponent} from '@ringo/core/containers/not-found-page.component';
import {NavItemComponent, SidenavComponent, ToolbarComponent} from '@ringo/core/components';
import {AppComponent} from '@ringo/core/containers';
import {SharedModule} from '@ringo/shared';
import {JwtInterceptor} from '@ringo/core/interceptors/jwt-interceptor';

@NgModule({
  declarations: [
    NotFoundPageComponent,
    AppComponent,
    NavItemComponent,
    SidenavComponent,
    ToolbarComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  imports: [
    /* 3rd party libraries */
    CommonModule,
    HttpClientModule,

    SharedModule
  ]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor (
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }

}
