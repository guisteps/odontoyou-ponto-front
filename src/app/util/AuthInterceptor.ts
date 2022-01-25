import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { LoaderService } from '../components/loader/loader.service';
import { finalize } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public loaderSrv: LoaderService, public router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('alive'))
            this.loaderSrv.show();
        const token = localStorage.token;

        if (!token) {
            return next.handle(req).pipe(finalize(() => this.loaderSrv.hide()));
        }

        if (localStorage.getItem('expires')) {
            const agora = new Date().getTime();
            const dtExpiracao = localStorage.getItem('expires') as string;
            if (agora > Number(dtExpiracao)) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('expires');
                this.loaderSrv.hide();
                this.router.navigate(['']);
                return EMPTY;
            }
        }

        const req1 = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        });

        return next.handle(req1).pipe(finalize(() => this.loaderSrv.hide()));
    }

}