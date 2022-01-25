import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationModel } from '../model/authentication.model';
import { ServiceBase } from '../util/ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ServiceBase {

  constructor(private http: HttpClient) {
    super();
  }

  alive() {
    return this.http.get(this.baseURL + '/alive');
  }

  login(body: any): Observable<AuthenticationModel> {
    return this.http.post<AuthenticationModel>(this.baseURL + '/autenticar', body);
  }
}
