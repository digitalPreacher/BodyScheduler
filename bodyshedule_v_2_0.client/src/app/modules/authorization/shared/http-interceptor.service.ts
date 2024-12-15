import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingService } from '../../shared/service/loading.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const token = localStorage.getItem("authToken");
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    } 
    return next.handle(request);
  }
}
