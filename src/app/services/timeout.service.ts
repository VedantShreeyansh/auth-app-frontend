import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {
  private timeoutId: any;
  
  constructor(private snackBar: MatSnackBar) {}

  startTimeout(duration: number, message: string, callback: () => void) {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.snackBar.open(message, 'Dismiss', { duration: 5000, verticalPosition: 'top' });
      callback();
    }, duration);
  }

  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}