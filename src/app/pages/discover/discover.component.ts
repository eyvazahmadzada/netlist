import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from './../../services/data.service';
import { WatchListService } from './../../services/watchlist.service';
import { Movie } from './../../shared/movie.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') keyword: ElementRef;
  showMovies = true;
  popular: Movie[];
  latest: Movie[];
  topRated: Movie[];
  searchResult: Movie[];
  fragmentSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private watchlistService: WatchListService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const toggleToMovies = fragment === 'movies';
        this.changeCategory(toggleToMovies);
      } else {
        this.router.navigate(['/discover'], { fragment: 'movies' });
      }
    });
  }

  loadData(): void {
    let latest = 'upcoming';
    if (!this.showMovies) {
      latest = 'airing_today';
    }
    this.dataService
      .getDataByType(this.showMovies, 'popular')
      .then((movies) => (this.popular = movies));
    this.dataService
      .getDataByType(this.showMovies, latest)
      .then((movies) => (this.latest = movies));
    this.dataService
      .getDataByType(this.showMovies, 'top_rated')
      .then((movies) => (this.topRated = movies));
  }

  toggleCategory(e): void {
    const toggleToMovies = e.target.innerHTML.trim() === 'Movies';
    this.changeCategory(toggleToMovies);
  }

  changeCategory(toggleToMovies): void {
    this.router.navigate(['/discover'], {
      fragment: toggleToMovies ? 'movies' : 'tvseries',
    });
    if (toggleToMovies !== this.showMovies) {
      this.showMovies = toggleToMovies;
      this.loadData();
      if (this.keyword) {
        this.searchByKeyword(this.keyword.nativeElement.value);
      }
    }
  }

  searchData(e): void {
    let searchKeyword = e.target.value.trim();
    setTimeout(() => {
      if (searchKeyword === e.target.value) {
        searchKeyword = e.target.value.split(' ').join('+');
        this.searchByKeyword(searchKeyword);
      }
    }, 500);
  }

  searchByKeyword(keyword: string): void {
    if (keyword !== '') {
      this.dataService
        .searchDataByTitle(this.showMovies, keyword)
        .then((data) => {
          this.searchResult = data;
        });
    } else {
      this.searchResult = [];
    }
  }

  ngOnDestroy(): void {
    this.fragmentSubscription.unsubscribe();
  }
}
