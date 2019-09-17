import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'rng-confirm-action-dialog',
  template: `
    <h1>{{data.title}}</h1>
    <mat-dialog-content>{{data.message}}</mat-dialog-content>
    <mat-dialog-actions>
        <button mat-flat-button class="cancel" [mat-dialog-close]="false">Cancel</button>
        <button mat-flat-button class="outline" [mat-dialog-close]="true">Confirm</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h1 {
        margin-bottom: 1rem;
    }
    
    mat-dialog-content {
        margin-bottom: 1rem;
        text-align:center;
    }
  `]
})
export class ConfirmActionDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, message: string},
              public dialogRef: MatDialogRef<ConfirmActionDialogComponent>) { }

  ngOnInit() {
  }
}
