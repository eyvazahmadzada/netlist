import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../shared/user.model';

interface ResponseData {
  localId: string;
  idToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiKey = 'AIzaSyAriMpCbLnN8K4wnVgwlu9Nu8nOW4m0fAU';
  authData = new EventEmitter<{ userData: User }>();

  constructor(private router: Router, private http: HttpClient) {}

  async authenticate(
    login = true,
    email: string,
    password: string
  ): Promise<User> {
    const credentials = {
      email,
      password,
      returnSecureToken: true,
    };
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    if (!login) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    }
    return await this.http
      .post<ResponseData>(url, credentials)
      .pipe(
        map((res) => {
          const expirationDate = new Date(
            new Date().getTime() + res.expiresIn * 1000
          );
          return new User(res.localId, res.idToken, expirationDate);
        })
      )
      .toPromise();
  }

  saveUserData(userData?: User, password?: string): void {
    this.http
      .post(
        `https://netlist-project.firebaseio.com/auth.json?auth=${userData.idToken}`,
        {
          fullName: userData.fullName,
          password,
          userId: userData.userId,
        }
      )
      .subscribe(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
      });
  }

  async getUserData(
    userData
  ): Promise<{ fullName: string; password: string; key: string }> {
    const queryParams =
      '?auth=' +
      userData.idToken +
      '&orderBy="userId"&equalTo="' +
      userData.userId +
      '"';
    return await this.http
      .get(`https://netlist-project.firebaseio.com/auth.json${queryParams}`)
      .pipe(
        map((res) => {
          for (const key in res) {
            if (res[key]) {
              return {
                fullName: res[key].fullName,
                password: res[key].password,
                key,
              };
            }
          }
        })
      )
      .toPromise();
  }

  async changeUserData(userData: User, password?: string): Promise<void> {
    let requestData;
    if (password) {
      requestData = { password };
    } else {
      requestData = { fullName: userData.fullName };
    }
    return await this.getUserData(userData).then((credentials) => {
      this.http
        .patch(
          `https://netlist-project.firebaseio.com/auth/${credentials.key}/.json?auth=${userData.idToken}`,
          requestData
        )
        .toPromise();
    });
  }

  async changeCredentials(requestData): Promise<any> {
    return await this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.apiKey}`,
        requestData
      )
      .toPromise();
  }

  async sendResetPasswordEmail(email: string): Promise<any> {
    return await this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`,
        { email, requestType: 'PASSWORD_RESET' }
      )
      .toPromise();
  }

  async resetPassword(oobCode: string, newPassword: string): Promise<any> {
    return await this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${this.apiKey}`,
        { oobCode, newPassword }
      )
      .toPromise();
  }

  handleResponse(userData): void {
    localStorage.setItem('userData', JSON.stringify(userData));
    this.handleAutoLogout(userData.expirationDate);
  }

  handleAutoLogout(expirationDate: Date): void {
    const expiresIn = new Date(expirationDate).getTime() - new Date().getTime();
    const expirationTimer = setTimeout(() => {
      this.logout();
      clearTimeout(expirationTimer);
    }, expiresIn);
  }

  logout(): void {
    if (localStorage.getItem('userData')) {
      localStorage.removeItem('userData');
      this.authData.emit({ userData: null });
      this.router.navigate(['']);
    }
  }

  get isAuthenticated() {
    return JSON.parse(localStorage.getItem('userData')) || false;
  }
}
