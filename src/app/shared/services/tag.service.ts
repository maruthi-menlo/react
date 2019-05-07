import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpUrls as urls } from '../data-models/httpUrls';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  api_url = `${environment.BASE_API}${environment.API}`;


  constructor(
    private http: HttpClient,
    private route:ActivatedRoute,
  ) { }

  getAllResources(obj) {
    let url = `${this.api_url}${urls.TAG_ALL_RESOURCES}`;
    return this.http.post(url,obj)
  }

  listAllTags(obj) {
    let url = `${this.api_url}${urls.TAG_ALL_TAGS}`;
    return this.http.post(url,obj)
  }

}