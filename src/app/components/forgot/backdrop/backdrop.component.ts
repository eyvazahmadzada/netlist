import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  templateUrl: 'backdrop.component.html',
  styleUrls: ['backdrop.component.css'],
})
export class BackdropComponent {
  @Output() modalClosed = new EventEmitter();

  closeModal(): void {
    this.modalClosed.emit(true);
  }
}
