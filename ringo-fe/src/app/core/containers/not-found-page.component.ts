import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rng-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>404: Not Found</mat-card-title>
      <mat-card-content>
        <p i18n="@@It looks like this page doesn't exist yet.">It looks like this page doesn't exist yet.</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" routerLink="/" i18n="@@Navigate Home">Navigate Home</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }
    `,
  ],
})
export class NotFoundPageComponent {}
