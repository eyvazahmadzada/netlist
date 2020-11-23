import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { WatchListService } from './../../../services/watchlist.service';
import { Movie } from './../../../shared/movie.model';

@Component({
  selector: 'app-movie',
  templateUrl: 'movie.component.html',
  styleUrls: ['movie.component.css'],
})
export class MovieComponent implements OnInit {
  movieData: Movie;
  isInWatchlist = null;
  isAuth = localStorage.getItem('userData');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private watchlistService: WatchListService
  ) {}

  ngOnInit(): void {
    const dataType = this.route.snapshot.url[0].path;
    const dataId = this.route.snapshot.params.id;
    if (dataType === 'movie') {
      this.dataService.getMovieById(dataId).then((resData) => {
        this.movieData = resData;
      });
    } else {
      this.dataService.getSerieById(dataId).then((resData) => {
        this.movieData = resData;
      });
    }
    this.isAuth ? this.checkIsInWatchlist() : (this.isInWatchlist = false);
  }

  checkIsInWatchlist(): void {
    this.watchlistService.getWatchlist(this.isAuth).then((data) => {
      if (data && data.watchlist) {
        this.isInWatchlist =
          data.watchlist.findIndex((item) => item.id === this.movieData.id) !==
          -1;
      } else {
        this.isInWatchlist = false;
      }
    });
  }

  watchlistAction(): void {
    if (this.isAuth) {
      if (!this.isInWatchlist) {
        this.watchlistService.addToWatchlist(this.movieData);
        this.isInWatchlist = true;
      } else {
        this.watchlistService.removeFromWatchlist(this.movieData);
        this.isInWatchlist = false;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
