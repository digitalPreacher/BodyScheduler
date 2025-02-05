import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingService } from '../../shared/service/loading.service';
import { CookieService } from '../../shared/service/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(private loadingService: LoadingService, private cookieService: CookieService) { }

  //interception request and add a token to header 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const token = this.cookieService.getCookie('token');
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    } 
    return next.handle(request);
  }
}
