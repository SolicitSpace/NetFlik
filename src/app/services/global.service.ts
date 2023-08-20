import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  posterImgUrl: string = environment.movieImgUrls[3];
  backdropImgUrl: string = environment.movieImgUrls[6];
  isRevealAll: boolean = false;

  headers: HttpHeaders = new HttpHeaders().set(
    'Authorization',
    `Bearer ${environment.movieDB_token}`
  );

  constructor() { }
  
}
