import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authData = this.authService.isAuthenticated;
  isOpen = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authData.subscribe((subs) => {
      this.authData = subs.userData;
    });
  }

  onToggleNavbar(): void {
    this.isOpen = !this.isOpen;
  }

  onSelectItem(): void {
    this.isOpen = false;
    document.querySelector('#navbarNavDropdown').classList.remove('show');
  }

  isLinkActive(url: string): boolean {
    return this.router.url === url;
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
