import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';

@Injectable()
export class GetJsonService {

    constructor(private http: HttpClient, private utilService: UtilService) { }

    public getJSON(fileName: string) {
      return this.http.get(environment.BASE_JSON_API + environment.JSON_LANG + fileName+'.json')
      .pipe(catchError(this.utilService.handleError)); 
    }
}