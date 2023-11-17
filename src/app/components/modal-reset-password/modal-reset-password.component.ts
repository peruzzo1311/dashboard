import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-modal-reset-password',
  templateUrl: './modal-reset-password.component.html',
  styleUrls: ['./modal-reset-password.component.scss'],
  providers: [LoginService, MessageService],
})
export class ModalResetPasswordComponent {
  @Input() tokenTemporario: string = '';
  @Input() usuario: string = '';

  senha = '';
  confirmarSenha = '';

  mostrarMenuRedefinirSenha = false;
  mostrarSenha = false;
  mostrarConfirmarSenha = false;
  carregando = false;

  constructor(
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  fecharMenuRedefinirSenha() {
    this.mostrarMenuRedefinirSenha = false;
    this.mostrarSenha = false;
    this.mostrarConfirmarSenha = false;

    this.senha = '';
    this.confirmarSenha = '';
  }

  show() {
    this.mostrarMenuRedefinirSenha = true;
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

  redefinirSenha() {
    switch (true) {
      case this.senha === '' || this.senha === undefined:
        this.mensagemErro('Informe a senha.');
        break;
      case this.confirmarSenha === '' || this.confirmarSenha === undefined:
        this.mensagemErro('Informe a confirmação da senha.');
        break;
      case this.senha !== this.confirmarSenha:
        this.mensagemErro('As senhas não conferem.');
        break;
      case this.senha.length < 6:
        this.mensagemErro('A senha deve ter no mínimo 6 caracteres.');
        break;
      case this.senha.length > 20:
        this.mensagemErro('A senha deve ter no máximo 20 caracteres.');
        break;
      default:
        this.carregando = true;

        this.loginService
          .redefinirSenha(this.usuario, this.tokenTemporario, this.senha)
          .subscribe({
            next: (response) => {
              this.carregando = false;

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Senha redefinida com sucesso.',
              });

              setTimeout(() => {
                this.messageService.clear();
              }, 3000);

              this.fecharMenuRedefinirSenha();
            },
            error: (error) => {
              console.log(error);
              this.mensagemErro(error.error.message);

              this.carregando = false;
            },
            complete: () => {
              this.carregando = false;
            },
          });
        break;
    }
  }
}
