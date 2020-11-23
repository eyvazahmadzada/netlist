import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { ErrorService } from './../../services/error.service';
import { User } from './../../shared/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  updateProfileDetails = true;
  errorMessage = '';
  successMessage = '';
  userData: User = this.authService.isAuthenticated;
  authSubscription: Subscription;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.authSubscription = this.authService.authData.subscribe((subs) => {
        this.userData = subs.userData;
      });
    }
  }

  selectCategory(e): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.updateProfileDetails = e.target.innerHTML.trim() === 'Profile Details';
  }

  update(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.updateProfileDetails) {
      const fullName = form.value.fullname.trim();
      const email = form.value.email.trim();
      if (email !== this.userData.email) {
        const updatedUserData: User = {
          ...this.userData,
          email,
        };
        this.isLoading = true;
        this.authService
          .changeCredentials({
            idToken: updatedUserData.idToken,
            email: updatedUserData.email,
            returnSecureToken: true,
          })
          .then(() => {
            this.isLoading = false;
            this.authService.authData.emit({ userData: updatedUserData });
          })
          .catch((error) => {
            this.isLoading = false;
            this.errorMessage = this.errorService.handleError(error);
          });
      }
      if (fullName !== this.userData.fullName) {
        const updatedUserData: User = {
          ...this.userData,
          fullName,
        };
        this.isLoading = true;
        this.authService.changeUserData(updatedUserData).then(() => {
          this.isLoading = false;
          this.authService.authData.emit({ userData: updatedUserData });
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        });
      }
    } else {
      this.authService.getUserData(this.userData).then((data) => {
        const curPassword = form.value.curpassword;
        const newPassword = form.value.newpassword;
        if (data.password === curPassword) {
          this.isLoading = true;
          this.authService
            .changeCredentials({
              idToken: this.userData.idToken,
              password: newPassword,
              returnSecureToken: true,
            })
            .then(() => {
              this.isLoading = false;
              this.authService.changeUserData(this.userData, newPassword);
              this.successMessage =
                'Your password has been successfully changed';
            })
            .catch((error) => {
              this.isLoading = false;
              this.errorMessage = this.errorService.handleError(error);
            });
        } else {
          this.errorMessage = 'Your current password is incorrect';
          this.updateProfileDetails = false;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
