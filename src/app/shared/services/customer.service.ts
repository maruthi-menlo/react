import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { httpUrls as urls } from '../data-models/httpUrls';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  api_url = `${environment.BASE_API}${environment.API}`;
  constructor(
    private http: HttpClient,
    private utilService: UtilService
  ) { }

  getCountries() {
    let url = `${this.api_url}${urls.COUNTRIES}`;
    return this.http.get(url)
  }

  getCountryStates(id) {
    const data = {"countryid": id }
    let url = `${this.api_url}${urls.STATES}`;
    return this.http.post(url, data)
  }

  getRoles(){
    let url = `${this.api_url}${urls.ROLES}`;
    return this.http.get(url)
  }

  addCustomer(data) {
    let url = `${this.api_url}${urls.DIRECT_CUSTOMER}`;
    return this.http.post(url, data)
  }
}