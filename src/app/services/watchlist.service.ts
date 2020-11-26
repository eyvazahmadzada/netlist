import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Movie } from './../shared/movie.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WatchListService {
  userData = this.authService.isAuthenticated;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createWatchlist(watchlist: Movie[]): void {
    this.http
      .post<void>(
        `https://netlist-project.firebaseio.com/watchlist.json?auth=${this.userData.idToken}`,
        { watchlist, userId: this.userData.userId }
      )
      .subscribe();
  }

  async getWatchlist(authData): Promise<{ watchlist: Movie[]; key: string }> {
    const queryParams =
      '?auth=' +
      authData.idToken +
      '&orderBy="userId"&equalTo="' +
      authData.userId +
      '"';
    return await this.http
      .get(
        `https://netlist-project.firebaseio.com/watchlist.json${queryParams}`
      )
      .pipe(
        map((res) => {
          for (const key in res) {
            if (res[key]) {
              return {
                watchlist: res[key].watchlist,
                key,
              };
            }
          }
        })
      )
      .toPromise();
  }

  updateWatchlist(key: string, watchlist): void {
    this.http
      .put(
        `https://netlist-project.firebaseio.com/watchlist/${key}/watchlist.json/?auth=${this.userData.idToken}`,
        { ...watchlist }
      )
      .subscribe();
  }

  addToWatchlist(movie: Movie): void {
    this.getWatchlist(this.userData).then((watchlistData) => {
      if (watchlistData && watchlistData.watchlist) {
        if (!watchlistData.watchlist.find((item) => item.id === movie.id)) {
          const updatedWatchlist = [...watchlistData.watchlist, movie];
          this.updateWatchlist(watchlistData.key, updatedWatchlist);
        }
      } else {
        console.log('creating');
        this.createWatchlist([movie]);
      }
    });
  }

  removeFromWatchlist(movie: Movie): void {
    this.getWatchlist(this.userData).then((watchlistData) => {
      const updatedWatchlist = watchlistData.watchlist.filter(
        (item) => item.id !== movie.id
      );
      this.updateWatchlist(watchlistData.key, updatedWatchlist);
    });
  }
}
