import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie-data';
import { GlobalService } from 'src/app/services/global.service';



@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Output() bannerActions = new EventEmitter<string>();
  @Output() movieSel = new EventEmitter<Movie>();
  
  showSkeletonLoader: boolean = true;

  // @Input() bannerMovie!: Movie;
  _bannerMovie!: Movie;
  @Input() set bannerMovie(value: Movie) {
    if (!value) return;
    this._bannerMovie = value;

    this.showSkeletonLoader = false;
    // setTimeout(()=> {
    // }, 250)
  }

  get bannerMovie(): Movie {
    return this._bannerMovie;
  }

  constructor(public global: GlobalService) {}

  ngOnInit() {}

  openMoreInfoModal() {
    this.bannerActions.emit("More info Modal - Open");

    // this.movieSel.emit(this.bannerMovie);
  }
}
