import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { WatchListService } from './services/watchlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private watchlistService: WatchListService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      const userData = this.authService.isAuthenticated;
      this.authService.authData.emit({
        userData,
      });
      this.authService.handleAutoLogout(userData.expirationDate);
    }
  }
}
