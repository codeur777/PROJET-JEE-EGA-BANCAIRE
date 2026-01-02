import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    console.log('🔐 JwtInterceptor appelé');
    console.log('📍 URL:', req.url);
    console.log('🎫 Token:', token ? '✅ Présent' : '❌ Absent');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Header Authorization ajouté');
    }

    return next.handle(req);
  }
}


