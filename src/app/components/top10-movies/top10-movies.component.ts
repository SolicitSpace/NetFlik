import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Movie, Movies } from 'src/app/models/movie-data';
import { MainPageServiceService } from 'src/app/services/main-page-service.service';
import { environment } from 'src/environments/environment.development';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-top10-movies',
  templateUrl: './top10-movies.component.html',
  styleUrls: ['./top10-movies.component.scss'],
})
export class Top10MoviesComponent implements OnInit {
  isShowCarousel: boolean = false;
  carouselItemsAdjVal: number = 2.55;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    navText: ['', ''],
    nav: false,
    margin: -50,
    lazyLoad: true,
  };

  // @Input() trendingMoviesData!: Movies;
  _trendingMoviesData!: Movies;
  @Input() set trendingMoviesData(value: Movies) {
    if (!value) return;
    this._trendingMoviesData = value;
    this.isShowCarousel = true;
  }

  get trendingMoviesData(): Movies {
    return this._trendingMoviesData;
  }

  @Output() movieSel = new EventEmitter<Movie>();

  constructor(
    private mainPageService: MainPageServiceService,
    public global: GlobalService
  ) {}

  ngOnInit(): void {
    this.customOptions.items = this.getCarouselItemsLimit();
  }

  /**
   * For getting the limit for number of items allowed in carousel
   * @returns number of items
   */
  getCarouselItemsLimit(): number {
    return window.innerWidth >= window.innerHeight
      ? (window.innerWidth / window.innerHeight) * this.carouselItemsAdjVal // For landscape
      : this.carouselItemsAdjVal; // For portrait
  }

  openMoreInfoSlider(movieData: Movie) {
    // this.movieSliderActions.emit("More info Modal - Open");
    this.movieSel.emit(movieData);
  }

  @HostListener('window:resize', ['$event'])
  onResize(evt: Event) {
    if (this.checkIfMinorResize()) return;

    this.isShowCarousel = false;
    this.customOptions.items = this.getCarouselItemsLimit();

    setTimeout(() => {
      this.isShowCarousel = true;
    }, 0);
  }

  savedInnerHeight: number = window.innerHeight;
  checkIfMinorResize() {
    // To prevent refreshing on minor screen resizes, esp. address bar hidding on scroll in mobile devices
    // Currently the resize recorded was more than 80% similar than it is a minor resize and hence refresh is ignored
    // If the resize is less than 90% similar then a refresh is need (orientation change)
    if (this.savedInnerHeight >= window.innerHeight) {
      if ((window.innerHeight / this.savedInnerHeight) * 100 > 80) return true;
    } else if (this.savedInnerHeight < window.innerHeight)
      if ((this.savedInnerHeight / window.innerHeight) * 100 > 80) return true;

    // assiging values; this happens when orientation is switched
    this.savedInnerHeight = window.innerHeight;

    // returning false stating that a major resize occured
    return false;
  }
}
