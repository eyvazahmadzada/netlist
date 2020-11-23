import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { FooterComponent } from './components/footer/footer.component';
import { BackdropComponent } from './components/forgot/backdrop/backdrop.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeCardComponent } from './components/home-card/home-card.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AccountComponent } from './pages/account/account.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { MovieComponent } from './pages/discover/movie/movie.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetComponent } from './pages/reset/reset.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DiscoverComponent,
    WatchlistComponent,
    AccountComponent,
    RegisterComponent,
    MovieCardComponent,
    ResetComponent,
    MovieComponent,
    ButtonComponent,
    SpinnerComponent,
    BackdropComponent,
    ForgotComponent,
    MovieCardComponent,
    ButtonComponent,
    HomeComponent,
    HomeCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
