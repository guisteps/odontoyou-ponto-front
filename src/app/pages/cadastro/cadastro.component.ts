import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../model/users.model';
import { UsuarioService } from '../../services/usuario.service';
import { ValidarAutenticacao } from '../../util/ValidarAutenticacao';

@Component({
  selector: 'cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent extends ValidarAutenticacao {

  frmFuncionario: FormGroup;

  constructor(public route: Router, public fb: FormBuilder, public snack: MatSnackBar, public userSrv: UsuarioService) {
    super(route);

    this.frmFuncionario = fb.group({
      cpf: new FormControl('', [Validators.required, Validators.maxLength(11)]),
      senha: new FormControl('', [Validators.required, Validators.minLength(4)]),
      senhaconf: new FormControl('', [Validators.required, Validators.minLength(4)]),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      adm: new FormControl('')
    });

    const user: User = JSON.parse(localStorage.getItem('user') as string);
    if (!user.adm) {
      Object.keys(this.frmFuncionario.controls).forEach(key => {
        this.frmFuncionario.get(key)?.disable();
      });
      this.snack.open('Você não possui permissão 😕', 'X', { duration: 3000 });
    }
  }


  salvar() {
    if (this.frmFuncionario.get('senha')?.value != this.frmFuncionario.get('senhaconf')?.value) {
      this.frmFuncionario.get('senha')?.setValue('');
      this.frmFuncionario.get('senhaconf')?.setValue('');
      this.snack.open('Senhas diferentes 😕', 'X', { duration: 3000 });
      return;
    }

    let novo = new User();
    novo.cpf = this.frmFuncionario.get('cpf')?.value;
    novo.senha = this.frmFuncionario.get('senha')?.value;
    novo.nome = this.frmFuncionario.get('nome')?.value;
    novo.email = this.frmFuncionario.get('email')?.value;
    novo.adm = this.frmFuncionario.get('adm')?.value;
    this.userSrv.salvar(novo).subscribe(r => {
      this.sucessoSalvar();
    }, error => {
      this.snack.open('Erro ao salvar! 😕', 'X', { duration: 3000 });
    })
  }


  sucessoSalvar() {
    this.frmFuncionario.reset();
    this.snack.open('Cadastrado com sucesso 😀', 'X', { duration: 3000 });
  }
}
