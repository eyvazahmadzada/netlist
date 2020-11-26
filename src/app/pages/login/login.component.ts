import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { ErrorService } from './../../services/error.service';
import { WatchListService } from './../../services/watchlist.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent {
  isLoading = false;
  isModalOpen = false;
  errorMessage = '';
  watchlistSubs: Subscription;
  redirectData = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService,
    private watchlistService: WatchListService
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

        let navigationUrl = '/discover';
        if (localStorage.getItem('redirectData') != null) {
          const redirectData = JSON.parse(localStorage.getItem('redirectData'));
          navigationUrl = redirectData.type + '/' + redirectData.id;
        }
        this.router.navigate([navigationUrl]);
        localStorage.removeItem('redirectData');
      })
      .catch((error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.errorService.handleError(error);
      });
  }

  // ngOnDestroy(): void {
  //   this.watchlistSubs.unsubscribe();
  // }
}
