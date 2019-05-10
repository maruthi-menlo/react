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

  autoCompleteTagsList(data){
    let url = `${this.api_url}${urls.AUTO_COMPLETE_TAGS}`;
    return this.http.post(url,data)
  }

  addTag(obj) {
    let url = `${this.api_url}${urls.ADD_TAG}`;
    return this.http.post(url,obj)
  }

  removeTag(obj) {
    let url = `${this.api_url}${urls.REMOVE_TAG}`;
    return this.http.post(url,obj)
  }



}