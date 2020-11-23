import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from './../../shared/movie.model';

@Component({
  selector: 'app-movie-card',
  templateUrl: 'movie-card.component.html',
  styleUrls: ['movie-card.component.css'],
})
export class MovieCardComponent {
  @Input() data: Movie;

  constructor(private router: Router) {}

  aboutMovie(): void {
    this.router.navigate([`/serie/${this.data.id}`]);
    if (this.data.isMovie) {
      this.router.navigate([`/movie/${this.data.id}`]);
    }
  }
}
