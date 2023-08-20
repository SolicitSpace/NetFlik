import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  Movie,
  MovieCredits,
  MovieDetails,
  MovieVideos,
} from 'src/app/models/movie-data';
import { MainPageServiceService } from '../../services/main-page-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {
  movieDetailsData!: MovieDetails;
  movieCreditsData!: MovieCredits;
  movieVideosData!: MovieVideos;
  videoUrl: string = '';
  numOfCastMemberToShow: number = 5;

  @Output() infoModalActions = new EventEmitter<string>();
  @Input() movieId!: number;

  constructor(private mainPageService: MainPageServiceService) {}

  ngOnInit() {
    // get movie Details via api
    this.getMovieDetails();
    this.getMovieCredits();
    this.getMovieVideos();
  }

  closeMoreinfoModal() {
    this.infoModalActions.emit('More info Modal - Close');
  }

  async getMovieDetails() {
    this.movieDetailsData = await this.mainPageService
      .getMovieDetailsData(this.movieId)
      .then((resData) => resData);
    console.log('this.movieDetailsData : ', this.movieDetailsData);
  }
  async getMovieCredits() {
    this.movieCreditsData = await this.mainPageService
      .getMovieCreditsData(this.movieId)
      .then((resData) => resData);
    console.log('this.movieCreditsData : ', this.movieDetailsData);
  }

  async getMovieVideos() {
    this.movieVideosData = await this.mainPageService
      .getMovieVideosData(this.movieId)
      .then((resData) => resData);
    // console.log('this.movieVideosData : ', this.movieVideosData);

    // extract only the yt vids from the collection
    const ytVidsOnly = this.movieVideosData.results.filter((data) => {
      return data.site.toLowerCase() == 'youtube' ? true : false;
    });

    // Need to check if the url is working . If not then Try the next url from the list
    this.videoUrl =
      ytVidsOnly.length > 0
        ? `https://www.youtube.com/embed/${ytVidsOnly[0].key}?controls=0`
        : 'NA';
  }

  getGenres() {
    if (!this.movieDetailsData) return;
    let str = '';

    for (let i = 0, len = this.movieDetailsData.genres.length; i < len; i++) {
      str += this.movieDetailsData.genres[i].name + (i < len - 1 ? ', ' : '');
    }
    return str;
  }
  getCast() {
    if (!this.movieCreditsData) return;
    let str = '';

    const len =
      this.movieCreditsData.cast.length < this.numOfCastMemberToShow
        ? this.movieCreditsData.cast.length
        : this.numOfCastMemberToShow;

    for (let i = 0; i < len; i++) {
      str += this.movieCreditsData.cast[i].name + (i < len - 1 ? ', ' : '');
    }
    return str;
  }
}
