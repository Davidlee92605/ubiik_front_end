import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rng-password-changed',
  template: `
    <div class="card">
      <div class="card-content">
        <fa-icon style="color: #0095A8" icon="check-circle-o"></fa-icon>
        <p i18n="@@You've successfully updated your password on your account">You've successfully updated your password on your account</p>
      </div>
    </div>
  `,
  styles: [`
    .card-content {
      margin: 80px auto auto auto;
      left: 0;
      right: 0;
      position: absolute;
      padding: 2.5%;
      width: 370px;
      height: 290px;
      border: 5px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 1px 1px 5px 1px rgba(191, 0, 0, 0.05);
    }
  `]
})
export class PasswordChangedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
