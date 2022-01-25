import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/users.model';
import { ServiceBase } from '../util/ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ServiceBase {

  baseService: string;

  constructor(private http: HttpClient) {
    super();
    this.baseService = this.baseURL + '/users';
  }

  getAllUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.baseService);
  }

  getUsuario(cpf: string): Observable<User> {
    return this.http.get<User>(this.baseService + '/' + cpf);
  }

  salvar(body: User): Observable<User> {
    return this.http.post<User>(this.baseService, body);
  }
}
