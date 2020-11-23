import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NotAuthGuard } from './../guards/not-auth.guard';
import { ResetGuard } from './../guards/reset.guard';
import { AccountComponent } from './pages/account/account.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { MovieComponent } from './pages/discover/movie/movie.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetComponent } from './pages/reset/reset.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'discover',
    component: DiscoverComponent,
  },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'serie/:id', component: MovieComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [AuthGuard],
  },
  { path: 'reset', component: ResetComponent, canActivate: [ResetGuard] },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
