import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  handleError(error: HttpErrorResponse): string {
    let errorMessage: string;
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address is already in use';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this account';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Your email is not valid';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Your password is not correct';
        break;
      case 'USER_DISABLED':
        errorMessage = 'Your account has been disabled';
        break;
      case 'TOKEN_EXPIRED':
        errorMessage = 'You might need to sign in again to change your details';
        break;
      case 'EXPIRED_OOB_CODE':
        errorMessage = 'Your password reset link has expired';
        break;
      case 'INVALID_OOB_CODE':
        errorMessage = 'Your password reset link is invalid';
        break;
      default:
        errorMessage = 'An unknown error has occured, please try again';
    }
    return errorMessage;
  }
}
