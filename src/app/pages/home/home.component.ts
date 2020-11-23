import { Component } from '@angular/core';
import { HomeCard } from './../../shared/home-card.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  cardItems: HomeCard[] = [
    {
      header: 'Review',
      body:
        'Review the movies or TV series and choose which one you want to watch.',
      image: 'choose',
      button: 'Choose',
      router: '/discover',
    },
    {
      header: 'Create an account',
      body:
        'By creating account, you will benefit from all the features that netlist provides.',
      image: 'create-account',
      button: 'Create',
      router: '/register',
    },
    {
      header: 'Make a watchlist',
      body:
        'Make a watclist and add, delete, mark as watched your movies as needed.',
      image: 'watchlist',
      button: 'Your watchlist',
      router: '/login',
    },
  ];
}
