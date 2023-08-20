import {
  OnInit,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { MainPageServiceService } from '../../services/main-page-service.service';
import { Genres, Movie, MovieDetails, Movies } from 'src/app/models/movie-data';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements AfterViewInit, OnInit {
  mainPageFreezeScroll: boolean = false;
  showMoreInfoModel: boolean = false;
  pageScrollY: number = 0;

  @ViewChild('mainContainer', { static: true }) mainContainerRef!: ElementRef;

  genreListData!: Genres;

  movieDetailsData!: MovieDetails;

  selMovieId!: number;

  trendingMoviesData!: Movies;

  bannerMovieData!: Movie;

  wasSearchResultsOpened: boolean = false;

  isSearching: boolean = false;
  // isSearching: boolean = true;
  searchInputVal: string = '';

  isFooterAttachBottom: boolean = false;

  constructor(private mainPageService: MainPageServiceService) {}

  ngAfterViewInit() {
    this.trackMainContainerScroll();
  }
  ngOnInit() {
    // Need to get genre data
    this.generateGenres();

    this.getTrendingMovies(); // need to shift this to top 10 module
  }

  async generateGenres() {
    this.genreListData = await this.mainPageService
      .getGenresData()
      .then((resData) => resData);
  }

  async getTrendingMovies() {
    this.trendingMoviesData = await this.mainPageService
      .getTrendingMoviesData()
      .then((resData) => resData);

    // the #1 trending movie should be on the banner
    this.bannerMovieData = this.trendingMoviesData.results[0];
  }

  trackMainContainerScroll() {
    fromEvent(this.mainContainerRef.nativeElement, 'scroll').subscribe(
      (e: any) => {
        this.pageScrollY = e.target['scrollTop'];
      }
    );
  }

  handleBannerActions(evt: any) {
    console.log('evt : ', evt);

    switch (evt) {
      case 'More info Modal - Open':
        this.showMoreInfoModel = true;
        this.handleFreezeMainPageScroll(true);
        break;
      default:
        console.error('Invalid Case from Banner Actions...');
    }
  }

  handleInfoModalActions(evt: any) {
    console.log('evt : ', evt);

    switch (evt) {
      case 'More info Modal - Close':
        this.showMoreInfoModel = false;
        this.handleFreezeMainPageScroll(false);
        break;
      default:
        console.error('Invalid Case from Banner Actions...');
    }
  }

  handleMovieSliderActions(evt: any) {
    console.log('evt : ', evt);

    switch (evt) {
      case 'More info Modal - Open':
        this.showMoreInfoModel = true;
        this.handleFreezeMainPageScroll(true);
        break;
      default:
        console.error('Invalid Case from Banner Actions...');
    }
  }

  showMoreInfoModal(movieData: Movie) {
    this.showMoreInfoModel = true;
    this.handleFreezeMainPageScroll(true);
    this.selMovieId = movieData.id;
    console.log('this.selMovieId : ', this.selMovieId);
  }

  handleFreezeMainPageScroll(setVal: boolean) {
    this.mainPageFreezeScroll = setVal;
    this.mainContainerRef.nativeElement.style.top = setVal
      ? -this.pageScrollY + 'px'
      : 0;
  }

  handleSearchInput(val: string) {
    this.searchInputVal = val;
    const isSearchVerified = val.trim().length > 0;
    this.isSearching = isSearchVerified;
    // Should only run once when the search panel is opened
    if (!this.wasSearchResultsOpened)
      this.setIsFooterAttachBottom(isSearchVerified); // to put the footer at bottom whenever the search Result component is activated

    this.wasSearchResultsOpened = isSearchVerified; // stating
  }

  setIsFooterAttachBottom(_isFooterAttachBottom: boolean) {
    this.isFooterAttachBottom = _isFooterAttachBottom;
  }

  refreshResults() {
    this.isSearching = true;
    setTimeout(() => {
      this.isSearching = false;
    }, 100);
  }
}
