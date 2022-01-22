import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationModel } from '../../model/authentication.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  cpf: string;
  senha: string;
  @ViewChild('btnLogin', { read: ElementRef }) btnLogin: ElementRef;

  constructor(public loginSrv: LoginService, public router: Router, public snack: MatSnackBar, public userSrv: UsuarioService) { }

  login() {
    this.loginSrv.login({ 'cpf': this.cpf, 'senha': this.senha }).subscribe(
      data => {
        this.sucessoLogado(data);
      }, error => {
        if (error.status == '401')
          this.erroAutenticar();
        else if (error.status == '403')
          this.usuarioNaoEncontrado();
      });
  }


  enterOk(event: any) {
    if (event.keyCode === 13)
      this.btnLogin.nativeElement.click();
  }


  sucessoLogado(data: AuthenticationModel) {
    localStorage.setItem('token', data.jwt);
    localStorage.setItem('expires', (new Date().getTime() + 300000).toString()); //5min
    this.infoUsuario();
  }


  infoUsuario() {
    this.userSrv.getUsuario(this.cpf).subscribe(u => {
      localStorage.setItem('user', JSON.stringify(u));
      this.router.navigate(['/ponto']);
      this.snack.open('Bem-vindo(a) 🔓', 'X', { duration: 2000 });
    });
  }


  erroAutenticar() {
    this.senha = '';
    this.snack.open('Senha incorreta 😕', 'X', { duration: 3000 });
  }


  usuarioNaoEncontrado() {
    this.cpf = '';
    this.senha = '';
    this.snack.open('CPF não encontrado 😕', 'X', { duration: 3000 });
  }
}
