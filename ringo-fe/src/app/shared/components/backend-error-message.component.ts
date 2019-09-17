import {Component, Input, OnInit} from '@angular/core';
import {BackendError} from '@ringo/core/models';

// TODO: add button to click for more details

@Component({
  selector: 'rng-backend-error-message',
  template: `
    <div *ngIf="error">
      <ng-container [ngSwitch]="error.code">

          <mat-error *ngSwitchCase="'EFORMAT'" i18n="@@There was a problem in with the file format, at position:">
              There was a problem in with the file format, at position: {{error.message}}
          </mat-error>

          <mat-error *ngSwitchCase="'EFILEEMPTY'" i18n="@@The selected file is empty">The selected file is empty</mat-error>


          <mat-error *ngSwitchCase="'ECOMPLEX'" i18n="@@Password failed complexity requirement">
              Password failed complexity requirement
          </mat-error>

          <mat-error *ngSwitchCase="'ECRED'" i18n="@@Invalid username or password">Invalid username or password</mat-error>

          <mat-error *ngSwitchCase="'ECRYPT'" i18n="@@Error encrypting password">Error encrypting password</mat-error>

          <mat-error *ngSwitchCase="'EDB'" i18n="@@A database error occurred">A database error occurred</mat-error>

          <mat-error *ngSwitchCase="'EDECODE'" i18n="@@Error decoding data chunk">Error decoding data chunk</mat-error>

          <mat-error *ngSwitchCase="'EEMAIL'" i18n="@@Error sending email">Error sending email</mat-error>

          <mat-error *ngSwitchCase="'EDEC'" i18n="@@Error decoding data">Error decoding data</mat-error>

          <mat-error *ngSwitchCase="'EENCRYPT'" i18n="@@Error generating token">Error generating token</mat-error>

          <mat-error *ngSwitchCase="'EHEX'" i18n="@@Input was not HEX formatted">Input was not HEX formatted</mat-error>

          <mat-error *ngSwitchCase="'EIMPACTBODY'" i18n="@@Error reading IMPACT resonse">Error reading IMPACT resonse</mat-error>

          <mat-error *ngSwitchCase="'EIMPACTHTTPCODE'" i18n="@@Invalid HTTP code from IMPACT">
              Invalid HTTP code from IMPACT
          </mat-error>

          <mat-error *ngSwitchCase="'EIMPACTNETWORK'" i18n="@@Network error communicating with IMPACT">
              Network error communicating with IMPACT
          </mat-error>

          <mat-error *ngSwitchCase="'EIMPACTREQFMT'" i18n="@@Error decoding IMPACT request">
              Error decoding IMPACT response
          </mat-error>

          <mat-error *ngSwitchCase="'EIMPACTRESPONSECODE'" i18n="@@Bad HTTP response code from IMPACT">
              Bad HTTP response code from IMPACT
          </mat-error>

          <mat-error *ngSwitchCase="'EIMPACTRESPONSEFMT'" i18n="@@Could not decode IMPACT response">
              Could not decode IMPACT response
          </mat-error>

          <mat-error *ngSwitchCase="'ELEN'" i18n="@@Command too short">Command too short</mat-error>

          <mat-error *ngSwitchCase="'EMISMATCH'" i18n="@@Password does not match">Password does not match</mat-error>

          <mat-error *ngSwitchCase="'ENOUSER'" i18n="@@User not found">User not found</mat-error>

          <mat-error *ngSwitchCase="'EREQ'" i18n="@@There was a problem with the backend request">
              There was a problem with the backend request
          </mat-error>

          <mat-error *ngSwitchCase="'EROLE'" i18n="@@Invalid role">Invalid role</mat-error>

          <mat-error *ngSwitchCase="'EROOTPW'" i18n="@@Cannot update root account info, use reset password instead">
              Cannot update root account info, use reset password instead
          </mat-error>

          <mat-error *ngSwitchCase="'ETMPFILECREATE'" i18n="@@Could not create temporary file">
              Could not create temporary file
          </mat-error>

          <mat-error *ngSwitchCase="'ETMPFILEWRITE'" i18n="@@Could not write temporary file">
              Could not write temporary file
          </mat-error>

          <mat-error *ngSwitchCase="'EZIPFILEWRITE'" i18n="@@Could not write ZIP file">Could not write ZIP file</mat-error>

          <mat-error *ngSwitchCase="'ENOFANSELECTED'" i18n="@@No FANs were selected, please select meters with associated FANs to continue">
              No FANs were selected, please select meters with associated FANs to continue
          </mat-error>

          <mat-error *ngSwitchDefault i18n="@@Something went wrong with the last request">
              Something went wrong with the last request
          </mat-error>

      </ng-container>
    </div>
  `,
  styles: []
})
export class BackendErrorMessageComponent implements OnInit {

  _error: BackendError | null = null;
  @Input() set error(e: BackendError | null) {
    if (e) {
      console.error('Backend Error:', e);
    }
    this._error = e;
  }

  get error() {
    return this._error;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
