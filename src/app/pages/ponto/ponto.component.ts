import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Pontos } from '../../model/pontos.model';
import { User } from '../../model/users.model';
import { PontoService } from '../../services/ponto.service';
import { ValidarAutenticacao } from '../../util/ValidarAutenticacao';

@Component({
  selector: 'ponto',
  templateUrl: './ponto.component.html',
  styleUrls: ['./ponto.component.scss']
})
export class PontoComponent extends ValidarAutenticacao implements OnInit {

  pontoHoje: Pontos = new Pontos();
  dataHoje: string;
  marcacao: number;
  cpf: string;
  @ViewChild('timediv', { read: ElementRef }) timediv: ElementRef;

  constructor(public route: Router, public pontoSrv: PontoService, public snack: MatSnackBar, public dp: DatePipe) {
    super(route);
    const user: User = JSON.parse(localStorage.getItem('user') as string);
    this.cpf = user.cpf;
  }

  ngOnInit(): void {
    this.relogioStart();
    this.getDataHoje();

    this.pontoSrv.pontosDoDia(this.cpf, this.dataHoje).subscribe(retPonto => {
      if (retPonto) {
        this.pontoHoje = retPonto;
      } else {
        this.pontoHoje = new Pontos();
        this.pontoHoje.cpf = this.cpf;
        this.pontoHoje.dia = this.dataHoje;
      }
    });
  }


  relogioStart() {
    setInterval(() => {
      if (this.timediv != null)
        this.timediv.nativeElement.innerHTML = new Date().toLocaleTimeString();
    }, 1000)
  }


  getDataHoje() {
    let hoje = new Date();
    let dia = (hoje.getDate() < 10 ? "0" : "") + hoje.getDate().toString();
    let mes = (hoje.getMonth() + 1 < 10 ? "0" : "") + (hoje.getMonth() + 1).toString();
    this.dataHoje = dia + mes + hoje.getFullYear().toString();
  }


  marcarPonto() {
    const dtAgora = this.dp.transform(new Date(), 'dd/MM/yyyy HH:mm:ss', 'pt-br') as string;

    if (this.marcacao == 1)
      this.pontoHoje.entrada = dtAgora;
    else if (this.marcacao == 2)
      this.pontoHoje.idaIntervalo = dtAgora;
    else if (this.marcacao == 3)
      this.pontoHoje.voltaIntervalo = dtAgora;
    else
      this.pontoHoje.saida = dtAgora;

    this.pontoSrv.salvarPonto(this.pontoHoje).subscribe(retPontoHoje => {
      this.marcacao = 0;
      this.pontoHoje = retPontoHoje;
      this.snack.open('Registrado com sucesso ✅', 'X', { duration: 3000 });
    });
  }
}
