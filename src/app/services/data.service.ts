import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Movie } from './../shared/movie.model';
import { WatchListService } from './watchlist.service';

interface ResponseData {
  id: number;
  title: string;
  name: string;
  genres: [{ id: number; name: string }];
  overview: string;
  poster_path: string;
  release_date: string;
  first_air_date: string;
  vote_average: number;
  runtime: number;
  episode_run_time: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiKey = '75d519a8250635c4a43b7aaaa3307808';

  constructor(
    private http: HttpClient,
    private watchlistService: WatchListService
  ) {}

  async getDataByType(showMovies = true, type: string): Promise<any> {
    let getData = 'movie';
    if (!showMovies) {
      getData = 'tv';
    }
    return await this.http
      .get<{ results: [] }>(
        `https://api.themoviedb.org/3/${getData}/${type}?api_key=${this.apiKey}&page=1`
      )
      .pipe(
        map((res) =>
          res.results.filter(
            (movie: ResponseData) => movie.poster_path !== null
          )
        ),
        map((movies) => {
          const filteredData = this.filterData(showMovies, movies);
          return filteredData;
        })
      )
      .toPromise();
  }

  async searchDataByTitle(showMovies = true, title: string): Promise<any> {
    let data = 'movie';
    if (!showMovies) {
      data = 'tv';
    }
    return await this.http
      .get<{ results: [] }>(
        `https://api.themoviedb.org/3/search/${data}?api_key=${this.apiKey}&query=${title}`
      )
      .pipe(
        map((res) =>
          res.results.filter(
            (movie: ResponseData) => movie.poster_path !== null
          )
        ),
        map((movies) => {
          const filteredData = this.filterData(showMovies, movies);
          return filteredData;
        })
      )
      .toPromise();
  }

  async getMovieById(id: number): Promise<Movie> {
    return await this.http
      .get<ResponseData>(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`
      )
      .pipe(
        map((movie) => {
          let genres = movie.genres.map((genre) => genre.name);
          if (movie.genres.length > 3) {
            genres = genres.slice(0, 3);
          }
          const year = new Date(movie.release_date).getFullYear();
          return new Movie(
            movie.id,
            movie.title,
            movie.runtime,
            genres,
            year,
            movie.vote_average,
            movie.overview,
            movie.poster_path,
            true
          );
        })
      )
      .toPromise();
  }

  async getSerieById(id: number): Promise<Movie> {
    return await this.http
      .get<ResponseData>(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${this.apiKey}`
      )
      .pipe(
        map((serie) => {
          let genres = serie.genres.map((genre) => genre.name);
          if (serie.genres.length > 3) {
            genres = genres.slice(0, 3);
          }
          const year = new Date(serie.first_air_date).getFullYear();
          return new Movie(
            serie.id,
            serie.name,
            serie.episode_run_time,
            genres,
            year,
            serie.vote_average,
            serie.overview,
            serie.poster_path,
            false
          );
        })
      )
      .toPromise();
  }

  filterData(showMovies: boolean, data): Movie[] {
    const resultData = [];
    data.forEach((item: { id: number }) => {
      if (showMovies) {
        this.getMovieById(item.id).then((movie) => {
          resultData.push(movie);
        });
      } else {
        this.getSerieById(item.id).then((serie) => {
          resultData.push(serie);
        });
      }
    });
    return resultData;
  }
}
