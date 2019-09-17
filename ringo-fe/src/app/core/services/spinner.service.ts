import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public enabled = false;

  constructor() { }

  stop() {
    this.enabled = false;
  }

  start() {
    this.enabled = true;
  }
}
