import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { ErrorService } from './../../services/error.service';

@Component({
  selector: 'app-forgot',
  templateUrl: 'forgot.component.html',
  styleUrls: ['forgot.component.css'],
})
export class ForgotComponent {
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  @Output() modalClosed = new EventEmitter();

  constructor(
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  closeModal(): void {
    this.modalClosed.emit(true);
  }

  onReset(form: NgForm): void {
    this.errorMessage = '';
    const email = form.value.email;
    this.isLoading = true;
    this.authService
      .sendResetPasswordEmail(email)
      .then(() => {
        this.isLoading = false;
        this.successMessage =
          'Email sent! Check your email address to reset your password';
        localStorage.setItem('resetPassword', 'true');
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorMessage = this.errorService.handleError(error);
      });
  }
}
