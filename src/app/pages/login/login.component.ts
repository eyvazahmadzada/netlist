import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ErrorService } from './../../services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent {
  isLoading = false;
  isModalOpen = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  onLogin(form: NgForm): void {
    this.isLoading = true;
    const email = form.value.email.trim();
    this.authService
      .authenticate(true, email, form.value.password)
      .then((userData) => {
        this.authService.getUserData(userData).then((data) => {
          const fullName = data.fullName;
          const updatedUserData = {
            ...userData,
            email,
            fullName,
          };
          this.authService.handleResponse(updatedUserData);
          this.authService.authData.emit({ userData: updatedUserData });
        });
        this.isLoading = false;
        this.router.navigate(['discover']);
      })
      .catch((error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.errorService.handleError(error);
      });
  }
}
