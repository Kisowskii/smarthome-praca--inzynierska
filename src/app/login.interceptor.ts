import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryElementsService } from './categoryElements/category-elements.service'; // Załóżmy, że AuthService jest w odpowiedniej lokalizacji

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private elementService: CategoryElementsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.elementService.getTokenFromStorage();
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
