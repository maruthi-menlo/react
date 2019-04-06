import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
declare var twttr:any;
declare var FB:any;

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  environment = environment;
  timer: any;
  constructor(
  ) { }

  public handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
}
