import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ErrorService } from './../../services/error.service';

@Component({
  selector: 'app-reset',
  templateUrl: 'reset.component.html',
  styleUrls: ['reset.component.css'],
})
export class ResetComponent {
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  navigate(): void {
    this.router.navigate(['/login']);
  }

  onReset(form: NgForm): void {
    this.errorMessage = '';
    const newPassword = form.value.newpassword;
    if (newPassword === form.value.repeatpassword) {
      const oobCode = this.route.snapshot.queryParams.oobCode;
      this.isLoading = true;
      this.authService
        .resetPassword(oobCode, newPassword)
        .then((res) => {
          this.isLoading = false;
          this.successMessage = 'Your password has been successfully reset';
          this.authService
            .authenticate(true, res.email, newPassword)
            .then((userData) => {
              this.authService.changeUserData(userData, newPassword).then();
            });
          localStorage.removeItem('resetPassword');
        })
        .catch((error) => {
          this.isLoading = false;
          this.errorMessage = this.errorService.handleError(error);
        });
    } else {
      this.errorMessage = ' Passwords do not match';
    }
  }
}
