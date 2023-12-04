import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ModalForgotPasswordComponent } from 'src/app/components/modal-forgot-password/modal-forgot-password.component';
import { ModalRegistroUsuarioComponent } from 'src/app/components/modal-registro-usuario/modal-registro-usuario.component';
import { ModalResetPasswordComponent } from 'src/app/components/modal-reset-password/modal-reset-password.component';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/types/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, MessageService],
})
export class LoginComponent {
  @ViewChild(ModalRegistroUsuarioComponent)
  modalRegistroUsuario!: ModalRegistroUsuarioComponent;

  @ViewChild(ModalResetPasswordComponent)
  modalResetPassword!: ModalResetPasswordComponent;

  @ViewChild(ModalForgotPasswordComponent)
  modalForgotPassword!: ModalForgotPasswordComponent;

  title = 'dashboard';
  carregando = false;
  mostrarSenha = false;
  tokenTemporario = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService
  ) {
    if (sessionStorage.getItem('usuario')) {
      this.router.navigate(['dashboard']);
    }
  }

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  showMenuRegistro() {
    this.modalRegistroUsuario.show();
  }

  showModalResetPassword() {
    this.modalResetPassword.show();
  }

  showModalForgotPassword() {
    this.modalForgotPassword.show();
  }

  entrar(usuario: string, senha: string) {
    this.carregando = true;
    usuario = `${usuario.trim().toLowerCase()}@kgepel.com.br`;
    let token = '';

    this.loginService.login(usuario, senha).subscribe({
      next: (res: any) => {
        if (res.resetPasswordInfo) {
          this.showModalResetPassword();

          this.tokenTemporario = res.resetPasswordInfo.temporaryToken;

          return;
        } else {
          token = JSON.parse(res.jsonToken).access_token;
        }

        this.loginService.getUser(usuario, token).subscribe({
          next: (res: any) => {
            const usuario: Usuario = res;
            usuario.token = token;

            if (usuario) {
              sessionStorage.setItem('usuario', JSON.stringify(usuario));

              this.router.navigate(['dashboard']);
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
}
