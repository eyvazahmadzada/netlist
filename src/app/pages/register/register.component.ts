import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ErrorService } from './../../services/error.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
})
export class RegisterComponent {
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  onRegister(form: NgForm): void {
    this.isLoading = true;
    const fullName = form.value.fullname.trim();
    const email = form.value.email.trim();
    const password = form.value.password.trim();
    this.authService
      .authenticate(false, email, form.value.password)
      .then((userData) => {
        this.isLoading = false;
        const updatedUserData = {
          ...userData,
          email,
          fullName,
        };
        this.authService.handleResponse(updatedUserData);
        this.authService.authData.emit({
          userData: updatedUserData,
        });
        this.authService.saveUserData(updatedUserData, password);
        this.router.navigate(['discover']);
      })
      .catch((error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.errorService.handleError(error);
      });
  }
}
