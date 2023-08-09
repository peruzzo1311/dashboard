import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Usuario from 'src/app/types/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService],
})
export class LoginComponent {
  @ViewChild('formulario') formulario!: NgForm;
  title = 'dashboard';
  mostrarSenha = false;
  carregando = false;

  constructor(private loginService: LoginService, private router: Router) {
    if (sessionStorage.getItem('usuario')) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  entrar(usuario: string, senha: string) {
    this.carregando = true;
    let token = '';

    this.loginService.login(usuario, senha).subscribe((res: any) => {
      token = JSON.parse(res.jsonToken).access_token;

      this.loginService.getUser(usuario, token).subscribe((res: any) => {
        const usuario: Usuario = res;
        usuario.token = token;

        if (usuario) {
          sessionStorage.setItem('usuario', JSON.stringify(usuario));

          this.router.navigate(['/dashboard']);
        } else {
          alert('Usuário não encontrado');
        }
      });
    });

    this.carregando = false;
  }
}
