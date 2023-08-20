import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Movie, Movies } from 'src/app/models/movie-data';
import { GlobalService } from 'src/app/services/global.service';
import { MainPageServiceService } from 'src/app/services/main-page-service.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent{
  // @Input() searchInputVal: string = '';

  @Output() movieSel = new EventEmitter<Movie>();
  @Output() notifyIfFooterAttachBottom = new EventEmitter<boolean>();

  _searchInputVal: string = '';
  moviesListBySearchData!: Movie[];

  @Input() set searchInputVal(value: string) {
    this._searchInputVal = value;
    this.getMovieListByQueryData();
  }

  get searchInputVal(): string {
    return this._searchInputVal;
  }

  constructor(
    private mainPageService: MainPageServiceService,
    public global: GlobalService
  ) {}
 
 

  async getMovieListByQueryData() {
    // this.moviesListBySearchData = [];
    let page1 = await this.mainPageService
      .getMovieListBySearchData(this._searchInputVal, 1)
      .then((resData) => resData.results);
    let page2 = await this.mainPageService
      .getMovieListBySearchData(this._searchInputVal, 2)
      .then((resData) => resData.results);

    const pagesData = page1.concat(page2);

    this.moviesListBySearchData = pagesData;

    this.handleFooterPosition(pagesData);
    // console.log(this.moviesListBySearchData);
  }

  handleFooterPosition(pagesData: Movie[]) {
    // If no results were found then attach the footer to the bottom
    if (pagesData.length > 20) this.notifyIfFooterAttachBottom.emit(false);
    // If some results were foudn then keep it floating i.e let it set it's position as per content
    else this.notifyIfFooterAttachBottom.emit(true);
  }

  openMoreInfoSlider(movieData: Movie) {
    console.log(movieData);
    // if (!this.isSliderDragging) this.movieSel.emit(movieData);
    this.movieSel.emit(movieData);
  }

  onImgError(elm: any) {
    elm.src = './assets/placeholder-img.jpg';
  }
}
