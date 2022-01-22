import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.token;

        if (!token) {
            return next.handle(req);
        }

        if (localStorage.getItem('expires')) {
            const agora = new Date().getTime();
            const dtExpiracao = localStorage.getItem('expires') as string;
            if (agora > Number(dtExpiracao)) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('expires');
                return EMPTY;
            }
        }

        const req1 = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        });

        return next.handle(req1);
    }

}