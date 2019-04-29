import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import {ValidationService} from './validation.service'

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  environment = environment;
  timer: any;
  currentRoute:string = '';
  regexStr: any = /^(?:100|\d{1,2})(?:\d{1,5}\.\d{0,1})?$/;
  constructor(
    private route: ActivatedRoute,
    private validationService:ValidationService
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
      let bodyHeight = document.body.offsetHeight-85;
      primaryNavElement && primaryNavElement.length ? primaryNavElement[0].style.height = height > bodyHeight ? `${height}px` : `${bodyHeight}px` : null;
      secondatNavElement && secondatNavElement.length ? secondatNavElement[0].style.height = height > bodyHeight ? `${height}px` : `${bodyHeight}px`  : null;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberAndDecimalOnly(event){
    const charCode = (event.which) ? event.which : event.keyCode;
    let ch = event.target.value;
    var charStr = String.fromCharCode(charCode);

    if(ch !== '' && ch.length !== 2 && ch<100){
      if(this.regexStr.test(ch)  && !ch.includes('.')){//
        if (((charCode > 31 && (charCode < 48 || charCode > 57))&& (charCode != 46))) {
          return false;
        }
      }else if(this.regexStr.test(ch) && ch.includes('.')){
        if (((charCode > 31 && (charCode < 48 || charCode > 57)))) {
          return false;
        }
      }else if(ch.length ==3 ){
        if (/^[a-zA-Z!@#$&()\\-`+,/\"]*$/.test(charStr)) {
          return false;
        }
      } else{
        return false
      }
    }else if(ch.length == 2 && (ch > 10)){
      if (/\d/.test(charStr)) {
        return false;
      }else if(this.regexStr.test(ch) && !ch.includes('.')){
        if (((charCode > 31 && (charCode < 48 || charCode > 57))&& (charCode != 46))) {
          return false;
        }
      }else if(this.regexStr.test(ch) && ch.includes('.')){
        if (((charCode > 31 && (charCode < 48 || charCode > 57)))) {
          return false;
        }
      }
    }else if(ch == 100){
      return false;
    }else if(ch.length == 2 && (ch == 10)){
      if (/^[a-zA-Z1-9!@#$&()\\-`+,/\"]*$/.test(charStr)) {
        return false;
      }
    }else if(ch.length == 2 || ch.includes('.')){
      if (((charCode > 31 && (charCode < 48 || charCode > 57)))) {
        return false;
      }
    }else{
      if (((charCode > 31 && (charCode < 48 || charCode > 57)))) {
        return false;
      }
      return true;
    }
 
  }

  get userRole() {
    const user = JSON.parse(localStorage.getItem('profile'));
    return user ? user['roleid'] : null;
  }

  get brandingLogo() {
    const user = JSON.parse(localStorage.getItem('profile'));
    return user && user['brandinginfo'][0] &&  user['brandinginfo'][0]['logoPath'] ? user['brandinginfo'][0]['logoPath'] : '/assets/images/logo.png';
  }
  
  get headerHexCode() {
    const user = JSON.parse(localStorage.getItem('profile'));
    return user && user['brandinginfo'][0] &&  user['brandinginfo'][0]['headerHexCode'] ? `#${user['brandinginfo'][0]['headerHexCode']}` : '#2a3438';
  }

  get primaryButtonHexCode() {
    const user = JSON.parse(localStorage.getItem('profile'));
    return user && user['brandinginfo'][0] &&  user['brandinginfo'][0]['primaryButtonHexCode'] ? `#${user['brandinginfo'][0]['primaryButtonHexCode']}` : '#35b2fc';
  }

  get activeFieldHexCode() {
    const user = JSON.parse(localStorage.getItem('profile'));
    return user && user['brandinginfo'][0] &&  user['brandinginfo'][0]['activeFieldHexCode'] ? `1px solid #${user['brandinginfo'][0]['activeFieldHexCode']}` : '1px solid #00a0ff';
  }
 
}
