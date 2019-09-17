import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'rng-meter-import-form',
  template: `
    <div class="card-content">
      <h1 i18n="@@Meter Key Upload">Meter Key Upload</h1>
      <p i18n="@@File type supported: CSV">File type supported: CSV</p>
      <p i18n="@@File format: TAB separated">File format: TAB separated</p>
      <p i18n="@@CSV fields: MeterID, GUK, AK, Address (optional), Coords (optional), Notes (optional)">
        CSV fields: MeterID, GUK, AK, Address (optional), Coords (optional), Notes (optional)</p>
      <p>
        <label for="file" i18n="@@Choose file">Choose file</label>
        <input type="file"
               id="file"
               [disabled]="pending"
               (click)="selectedFile = undefined"
               (change)="handleFileInput($event.target.files)">
      </p>
      <p *ngIf="uploadSuccess" i18n="@@File imported successfully">File imported successfully</p>
      <rng-backend-error-message *ngIf="genericError"></rng-backend-error-message>
      <mat-error *ngIf="formatError" i18n="@@There was a problem in with the file format, at position:">
        There was a problem in with the file format, at position: {{formatError}}</mat-error>
      <mat-error *ngIf="zeroSize" i18n="@@The selected file is empty">The selected file is empty</mat-error>
      <div class="card-actions">
        <button mat-flat-button type="button" class="cancel" routerLink="/meters" i18n="@@Back to login">Cancel</button>
        <span><button mat-flat-button (click)="submitFileUpload()" [disabled]="!selectedFile || pending" i18n="@@Upload">Upload</button></span>
      </div>
    </div>
  `,
  styles: [`
    .card-content {
      align-self: center;
      margin: 5rem auto auto auto;
      width: 23rem;
      padding: 2rem;
    }

    .card-actions {
      margin-top: 1rem;
    }
    h1 {
      margin-bottom: 2rem;
    }

    p {
      color: #666666;
      font-size: 14px;
      font-weight: 300;
      margin: 2%;
    }
    
    button {
      margin: 2%;
      width: 46%;
    }
  `]
})
export class MeterImportFormComponent implements OnInit {

  // upload
  selectedFile: File | null | undefined;
  _success = false;

  @Input() formatError: string | null = null;
  @Input() genericError = false;
  @Input() pending = false;
  zeroSize = false;
  @Output() uploadFile = new EventEmitter<File>();

  constructor() {
  }

  get uploadSuccess() {
    return this._success;
  }

  @Input() set uploadSuccess(b: boolean) {
    this._success = b;
    this.selectedFile = null;
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    console.log('input-files', files);
    if (files.length === 0) {
      return;
    }
    const f = files.item(0);
    if (f) {
      if (f.size === 0) {
        this.zeroSize = true;
      } else {
        this.zeroSize = false;
        this.selectedFile = f;
      }
    }
  }

  submitFileUpload() {
    if (this.selectedFile) {
      this.uploadFile.emit(this.selectedFile);
    }
  }
}
