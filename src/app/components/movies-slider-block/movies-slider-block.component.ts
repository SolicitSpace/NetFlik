import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Genre, Movies, Movie } from 'src/app/models/movie-data';
import { GlobalService } from 'src/app/services/global.service';
import { MainPageServiceService } from 'src/app/services/main-page-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-movies-slider-block',
  templateUrl: './movies-slider-block.component.html',
  styleUrls: ['./movies-slider-block.component.scss'],
})
export class MovieSliderBlockComponent implements OnInit {
  moviesListData!: Movies;
  isSliderDragging: boolean = false;
  isShowCarousel: boolean = false;
  carouselItemsAdjVal: number = 4.15;

  @Input('genre-data') genreData!: Genre;

  @Output() movieSliderActions = new EventEmitter<string>();
  @Output() movieSel = new EventEmitter<Movie>();

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    navText: ['', ''],
    nav: false,
    margin: 0,
    // lazyLoad: true,
  };

  numeroUnoMovie!: Movie;

  constructor(
    private mainPageService: MainPageServiceService,
    public global: GlobalService
  ) {}

  // @ViewChild("carousel") carousel!: CarouselComponent;

  ngOnInit(): void {
    this.customOptions.items = this.getCarouselItemsLimit();

    this.generateMoviesByGenre();
    // document.write("" + window.innerWidth + ", " + window.innerHeight + "  || ")
    // document.write("" + this.isIOS())
  }

  /**
   * For getting the limit for number of items allowed in carousel
   * @returns number of items
   */
  getCarouselItemsLimit(): number {
    // changing the `carouselItemsAdjVal` only for ios landscape to maintain consitent gaps
    // Landscapes for ios & non-ios
    if (this.isIOS() && this.isLandscape()) this.carouselItemsAdjVal = 4.0;
    else if (!this.isIOS() && this.isLandscape()) {
      // For non-ios phones & desktop
      if (screen.width / screen.height > 2)
        this.carouselItemsAdjVal = 3.5; // landscape mobile
      else this.carouselItemsAdjVal = 4.15; // desktops, 16:9
    }

    // setting for portrait
    else if (!this.isLandscape()) this.carouselItemsAdjVal = 4.15;

    return this.isLandscape()
      ? (window.innerWidth / window.innerHeight) * this.carouselItemsAdjVal // For landscape
      : this.carouselItemsAdjVal; // For portrait
  }
  isLandscape() {
    return window.innerWidth >= window.innerHeight;
  }
  isIOS() {
    return (
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  }

  async generateMoviesByGenre() {
    this.moviesListData = await this.mainPageService
      .getMoviesByGenre(this.genreData.id)
      .then((resData) => resData);

    this.isShowCarousel = true;
  }

  openMoreInfoSlider(movieData: Movie) {
    // console.log(this.isSliderDragging);

    if (!this.isSliderDragging) this.movieSel.emit(movieData);
    // this.movieSliderActions.emit("More info Modal - Open");
  }
  manageDragstatus(e: any) {
    // if currently being dragged then change status instantly
    // If the drag has ended change status with slight delay
    if (e.dragging) this.isSliderDragging = e.dragging;
    else
      setTimeout(() => {
        this.isSliderDragging = e.dragging;
      }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(evt: any) {
    if (this.checkIfMinorResize()) return;

    this.isShowCarousel = false;

    this.customOptions.items = this.getCarouselItemsLimit();

    setTimeout(() => {
      this.isShowCarousel = true;
    }, 0);
    return 0;
  }

  savedInnerHeight: number = window.innerHeight;
  checkIfMinorResize() {

    if (this.isMobileBrowser())
      if (this.savedInnerHeight >= window.innerHeight) {
        // To prevent refreshing on minor screen resizes, esp. address bar hidding on scroll in mobile devices
        // Currently the resize recorded was more than 80% similar than it is a minor resize and hence refresh is ignored
        // If the resize is less than 90% similar then a refresh is need (orientation change)
        if ((window.innerHeight / this.savedInnerHeight) * 100 > 80)
          return true;
      } else if (this.savedInnerHeight < window.innerHeight)
        if ((this.savedInnerHeight / window.innerHeight) * 100 > 80)
          return true;

    // assiging values; this happens when orientation is switched
    this.savedInnerHeight = window.innerHeight;

    // returning false stating that a major resize occured
    return false;
  }

  isMobileBrowser() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);
    return check;
  }
}
