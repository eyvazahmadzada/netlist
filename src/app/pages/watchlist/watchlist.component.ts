import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { WatchListService } from './../../services/watchlist.service';
import { Movie } from './../../shared/movie.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit, OnDestroy {
  movies: Movie[];
  authSubscription: Subscription;
  authData = this.authService.isAuthenticated;

  constructor(
    private watchlistService: WatchListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authData.subscribe((subs) => {
      this.authData = subs.userData;
    });
    this.watchlistService.getWatchlist().then((data) => {
      if (data && data.watchlist) {
        this.movies = data.watchlist;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
