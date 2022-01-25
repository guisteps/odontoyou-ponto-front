import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/users.model';
import { UsuarioService } from '../../services/usuario.service';
import { ValidarAutenticacao } from '../../util/ValidarAutenticacao';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { PontoService } from '../../services/ponto.service';
import { DatePipe } from '@angular/common';
import { Pontos } from '../../model/pontos.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})
export class ConsultaComponent extends ValidarAutenticacao implements OnInit {

  ltFuncionarios: User[];
  ltPontosDoMes: Pontos[];
  funcionario: User;
  date = new FormControl(moment());
  dtFormatada: string;
  displayedColumns: string[] = ['dia', 'entrada', 'idaIntervalo', 'voltaIntervalo', 'saida'];

  constructor(public route: Router, public userSrv: UsuarioService, public pontoSrv: PontoService, public dp: DatePipe, public snack: MatSnackBar) {
    super(route);
  }

  ngOnInit(): void {
    this.userSrv.getAllUsuarios().subscribe(ltUser => {
      this.ltFuncionarios = ltUser ? ltUser : [];
    });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


  buscar() {
    this.dtFormatada = this.dp.transform(this.date.value.toDate(), 'MMyyyy') as string;
    this.pontoSrv.pontosDoMes(this.funcionario.cpf, this.dtFormatada).subscribe(ltRetPonto => {
      this.ltPontosDoMes = ltRetPonto ? ltRetPonto : [];

      if (this.ltPontosDoMes.length > 0)
        this.ltPontosDoMes.forEach(el => {
          el.dia = el.dia.substring(0, 2) + '/' + el.dia.substring(2, 4) + '/' + el.dia.substring(4);
        });
      else
        this.snack.open('Não há registros 😕', 'X', { duration: 4000 });
    });
  }


  excel() {
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const fileName = this.funcionario.nome.replace(/ +/g, "") + '_' + this.dtFormatada + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }
}
