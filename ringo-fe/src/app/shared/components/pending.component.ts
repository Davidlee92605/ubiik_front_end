import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'rng-pending',
  template: `
      <div class="wrapper">
          <div class="overlay" *ngIf="pending">
              <div class="spinner-wrapper">
                  <rng-spinner></rng-spinner>
              </div>
          </div>
          <div class="loaded-content" [class.blurred]="pending">
              <ng-content></ng-content>
          </div>
      </div>
<!--      <a (click)="toggle()">Toggle spinner</a>-->
  `,
  styles: [`
      .wrapper {
          width: 100%;
          height: 100%;
          position: relative;
      }

      .overlay {
          position: absolute;
          z-index: 1002;
          background-color: rgba(255, 255, 255, 0.5);
          width: 100%;
          height: 100%;
      }

      .spinner-wrapper {
          display: flex;
          justify-content: center;
          justify-items: center;
      }
  `]
})
export class PendingComponent implements OnInit {

  @Input() pending = false;
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.pending = !this.pending;
  }
}
