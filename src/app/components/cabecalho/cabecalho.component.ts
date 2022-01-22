import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.scss']
})
export class CabecalhoComponent implements OnInit {

  currentRoute: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });
  }

  sair() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['']);
  }

}
