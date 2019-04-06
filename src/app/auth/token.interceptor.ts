// src/app/auth/token.interceptor.ts

import { Injectable, Injector, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private inj: Injector
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.inj.get(AuthService);
    const token = auth.getToken;
      // Set token if user logged in
      if (token && request.url.indexOf('login') === -1) {
        request = request.clone({ headers: request.headers.set('x-Auth-Token', `${token}`) });
      }
      return next.handle(request);
    }
    
  }