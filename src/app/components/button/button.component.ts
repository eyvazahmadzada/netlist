import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.css'],
})
export class ButtonComponent {
  @Output() buttonClicked = new EventEmitter<any>();

  @Input() disabled: boolean;
  @Input() color: string;
  @Input() width: number;

  onButtonClicked(event): void {
    this.buttonClicked.emit(event);
  }
}
