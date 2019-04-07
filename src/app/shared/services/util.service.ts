import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UtilService {
  environment = environment;
  timer: any;
  currentRoute:string = '';
  constructor(
    private route: ActivatedRoute
  ) { 
  }

  public handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }

  public formatFileSize(bytes, decimalPoint) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  //Set nav bar height here.
  setNavHeight(className) {
    const getElement = document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
    if(getElement[0]) {
      const height = getElement[0].clientHeight;
      let primaryNavElement = document.getElementsByClassName('primaryNavbar') as HTMLCollectionOf<HTMLElement>;
      let secondatNavElement = document.getElementsByClassName('secondaryNavbar') as HTMLCollectionOf<HTMLElement>;
      primaryNavElement[0].style.height = `${height}px`;
      secondatNavElement[0].style.height = `${height}px`;
    }
  }
 
}
