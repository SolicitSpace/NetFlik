import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { GlobalService } from './global.service';
import { Genres, MovieCredits, MovieDetails, MovieVideos, Movies } from 'src/app/models/movie-data';

@Injectable({
  providedIn: 'root',
})
export class MainPageServiceService {
  constructor(private http: HttpClient, private global: GlobalService) {}

  getGenresData(): Promise<Genres> {
    return new Promise((res) => {
      this.http
        .get<Genres>(`${environment.movieDB_baseUrl}/3/genre/movie/list`, {
          headers: this.global.headers,
        })
        .subscribe((resData) => res(resData));
    });
  }
  getMoviesByGenre(genreId: number): Promise<Movies> {
    let params = new HttpParams();
    params = params.append('include_adult', this.global.isRevealAll);
    params = params.append('include_video', false);
    params = params.append('language', 'en-US');
    params = params.append('page', 1);
    params = params.append('sort_by', 'popularity.desc');
    params = params.append('with_genres', genreId);

    return new Promise((res) => {
      this.http
        .get<Movies>(`${environment.movieDB_baseUrl}/3/discover/movie`, {
          params: params,
          headers: this.global.headers,
        })
        .subscribe((resData) => res(resData));
    });
  }

  getTrendingMoviesData(): Promise<Movies> {
    return new Promise((res) => {
      this.http
        .get<Movies>(`${environment.movieDB_baseUrl}/3/movie/popular`, {
          headers: this.global.headers,
        })
        .subscribe((resData) => res(resData));
    });
  }

  getMovieDetailsData(movieId: number): Promise<MovieDetails> {
    return new Promise((res) => {
      this.http
        .get<MovieDetails>(
          `${environment.movieDB_baseUrl}/3/movie/${movieId}`,
          {
            headers: this.global.headers,
          }
        )
        .subscribe((resData) => res(resData));
    });
  }
  getMovieCreditsData(movieId: number): Promise<MovieCredits> {
    return new Promise((res) => {
      this.http
        .get<MovieCredits>(
          `${environment.movieDB_baseUrl}/3/movie/${movieId}/credits`,
          {
            headers: this.global.headers,
          }
        )
        .subscribe((resData) => res(resData));
    });
  }

  getMovieVideosData(movieId: number): Promise<MovieVideos> {
    return new Promise((res) => {
      this.http
        .get<MovieVideos>(
          `${environment.movieDB_baseUrl}/3/movie/${movieId}/videos`,
          {
            headers: this.global.headers,
          }
        )
        .subscribe((resData) => res(resData));
    });
  }

  getMovieListBySearchData(searchQuery: string, pageNum: number): Promise<Movies> {
    let params = new HttpParams();
    params = params.append('query', searchQuery);
    params = params.append('include_adult', this.global.isRevealAll);
    params = params.append('language', 'en-US');
    params = params.append('page', pageNum);

    return new Promise((res) => {
      this.http
        .get<Movies>(
          `${environment.movieDB_baseUrl}/3/search/movie`,
          {
            params: params,
            headers: this.global.headers,
          }
        )
        .subscribe((resData) => res(resData));
    });
  }
}
