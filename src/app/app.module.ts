import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Top10MoviesComponent } from './components/top10-movies/top10-movies.component';
import { MovieSliderBlockComponent } from './components/movies-slider-block/movies-slider-block.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { DurationPipe } from './pipes/duration.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    NotFoundComponent,
    Top10MoviesComponent,
    MovieSliderBlockComponent,
    InfoModalComponent,
    DurationPipe,
    SafeUrlPipe,
    SearchResultsComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    CarouselModule,
    HttpClientModule,
    NgxSkeletonLoaderModule.forRoot({
      animation: "progress",
      loadingText: 'Loading',
      theme: {
        // Enabliong theme combination
        extendsFromRoot: true,
        // ... list of CSS theme attributes
        width: "20vmin",
        height: "30vmin",
        borderRadius: "0"
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
