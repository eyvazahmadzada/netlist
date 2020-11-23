import { Component, Input } from '@angular/core';
import { HomeCard } from './../../shared/home-card.model';

@Component({
  selector: 'app-home-card',
  templateUrl: 'home-card.component.html',
  styleUrls: ['home-card.component.css'],
})
export class HomeCardComponent {
  @Input() cardItem: HomeCard;
}
