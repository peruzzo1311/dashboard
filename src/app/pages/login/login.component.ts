import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import Usuario from 'src/app/types/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, MessageService],
})
export class LoginComponent {
  @ViewChild('formulario') formulario!: NgForm;

  title = 'dashboard';
  mostrarSenha = false;
  carregando = false;

  login$!: Subscription;
  getUser$!: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService
  ) {
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

    this.loginService.login(usuario, senha).subscribe({
      next: (res: any) => {
        token = JSON.parse(res.jsonToken).access_token;

        this.loginService.getUser(usuario, token).subscribe({
          next: (res: any) => {
            const usuario: Usuario = res;
            usuario.token = token;

            if (usuario) {
              sessionStorage.setItem('usuario', JSON.stringify(usuario));

              this.router.navigate(['/dashboard']);
            } else {
              alert('Usuário não encontrado');
            }
          },
          error: (err: any) => {
            if (err.error.message) {
              this.mensagemErro(err.error.message);
            } else {
              this.mensagemErro(
                'Serviço indisponível, tente novamente mais tarde!'
              );
            }
          },
          complete: () => (this.carregando = false),
        });
      },
      error: (err: any) => {
        if (err.error.message) {
          this.mensagemErro(err.error.message);
        } else {
          this.mensagemErro(
            'Serviço indisponível, tente novamente mais tarde!'
          );
        }
      },
      complete: () => (this.carregando = false),
    });

    this.carregando = false;
  }

  mensagemErro(mensagem: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.login$) {
      this.login$.unsubscribe();
    }

    if (this.getUser$) {
      this.getUser$.unsubscribe();
    }
  }
}
