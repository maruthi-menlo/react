// src/app/auth/jwt.interceptor.ts
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { LoaderService } from '../shared/services/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  loading: any;

  constructor(
    private injector: Injector
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);
    const loader = this.injector.get(LoaderService);
    loader.show();
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        setTimeout(() => {
          loader.hide();
        }, 500);
        if (event.url.indexOf('login') > -1) {
          loader.hide();
          if (event.body) {
            let token = event.body.data.token;
            let user = event.body.data;
            auth._setSession(token, user);
          }
        }
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        setTimeout(() => {
          loader.hide();
        }, 500);
        if (err.status === 401) {
          auth.logout(err.status);
          return event;
        }
      }
    }));
  }
}