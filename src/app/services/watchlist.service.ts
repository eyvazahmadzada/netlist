import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Movie } from './../shared/movie.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WatchListService {
  userData = JSON.parse(localStorage.getItem('userData'));

  constructor(private http: HttpClient, private authService: AuthService) {}

  createWatchlist(watchlist: Movie[]): void {
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.http
      .post<void>(
        `https://netlist-project.firebaseio.com/watchlist.json?auth=${userData.idToken}`,
        { watchlist, userId: userData.userId }
      )
      .subscribe();
  }

  async getWatchlist(): Promise<{ watchlist: Movie[]; key: string }> {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const queryParams =
      '?auth=' +
      userData.idToken +
      '&orderBy="userId"&equalTo="' +
      userData.userId +
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
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.http
      .put(
        `https://netlist-project.firebaseio.com/watchlist/${key}/watchlist.json/?auth=${userData.idToken}`,
        { ...watchlist }
      )
      .subscribe();
  }

  addToWatchlist(movie: Movie): void {
    this.getWatchlist().then((watchlistData) => {
      if (watchlistData && watchlistData.watchlist) {
        if (!watchlistData.watchlist.find((item) => item.id === movie.id)) {
          const updatedWatchlist = [...watchlistData.watchlist, movie];
          this.updateWatchlist(watchlistData.key, updatedWatchlist);
        }
      } else {
        this.createWatchlist([movie]);
      }
    });
  }

  removeFromWatchlist(movie: Movie): void {
    this.getWatchlist().then((watchlistData) => {
      const updatedWatchlist = watchlistData.watchlist.filter(
        (item) => item.id !== movie.id
      );
      this.updateWatchlist(watchlistData.key, updatedWatchlist);
    });
  }
}
