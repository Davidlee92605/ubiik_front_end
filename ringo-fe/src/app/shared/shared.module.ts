import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CustomMaterialModule} from './material/custom-material.module';
import {FormDebugComponent} from './components/form-debug.component';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faAngleUp,
  faBell,
  faChartBar,
  faClipboardList,
  faCloudUploadAlt,
  faEnvelope,
  faEye,
  faFireExtinguisher,
  faGlobe,
  faLock,
  faMinus,
  faPaperclip,
  faPen,
  faPlus,
  faPoll,
  faPowerOff,
  faSearch,
  faTrash,
  faUserCircle,
  faUserEdit,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BackendErrorMessageComponent} from './components/backend-error-message.component';
import {HESDate} from '@ringo/shared/pipes/hes-timestamp';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import {LUXON_DATE_FORMATS, LuxonDateAdapter} from '@ringo/shared/adapters/luxon-date-adapter';
import { PendingComponent } from './components/pending.component';
import { SpinnerComponent } from './components/spinner.component';
import {ConfirmActionDialogComponent} from '@ringo/core/components/confirm-action-dialog.component';

@NgModule({
  declarations: [
    FormDebugComponent,
    BackendErrorMessageComponent,
    HESDate,
    PendingComponent,
    SpinnerComponent,
    ConfirmActionDialogComponent
  ],
  entryComponents: [
    ConfirmActionDialogComponent
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormDebugComponent,
    FontAwesomeModule,
    BackendErrorMessageComponent,
    HESDate,
    PendingComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: LuxonDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: LUXON_DATE_FORMATS},
  ]
})
export class SharedModule {
  constructor() {
    library.add(
      faSearch,
      faPoll,
      faBell,
      faEye,
      faChartBar,
      faClipboardList,
      faFireExtinguisher,
      faGlobe,
      faUserPlus,
      faLock,
      faMinus,
      faPaperclip,
      faPen,
      faPowerOff,
      faAngleUp,
      faAngleDown,
      faTrash,
      faUserEdit,
      faEnvelope,
      faUserCircle,
      faCloudUploadAlt,
      faPlus,
    );
  }

}
