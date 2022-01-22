import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pontos } from '../model/pontos.model';
import { ServiceBase } from '../util/ServiceBase';

@Injectable({
  providedIn: 'root'
})
export class PontoService extends ServiceBase {

  baseService: string;

  constructor(private http: HttpClient) {
    super();
    this.baseService = this.baseURL + '/pontos';
  }

  pontosDoDia(cpf: string, dia: string): Observable<Pontos> {
    return this.http.get<Pontos>(this.baseService + '/dia/' + cpf + "/" + dia);
  }

  pontosDoMes(cpf: string, mesAno: string): Observable<Pontos> {
    return this.http.get<Pontos>(this.baseService + '/mes/' + cpf + "/" + mesAno);
  }

  salvarPonto(body: Pontos): Observable<Pontos> {
    return this.http.post<Pontos>(this.baseService, body);
  }
}
