import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/types/Usuario';

@Component({
  selector: 'app-modal-forgot-password',
  templateUrl: './modal-forgot-password.component.html',
  styleUrls: ['./modal-forgot-password.component.scss'],
  providers: [LoginService, MessageService],
})
export class ModalForgotPasswordComponent {
  mostrarMenuEsqueciSenha = false;
  isLoading = false;
  username = '';
  email = '';
  newPassword = 'S@p1ens';
  success = false;
  user: Usuario = {} as Usuario;

  constructor(
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  hide() {
    this.mostrarMenuEsqueciSenha = false;
    this.success = false;
    this.username = '';
    this.email = '';
    this.isLoading = false;
  }

  show() {
    this.mostrarMenuEsqueciSenha = true;
  }

  recuperarSenha() {
    this.isLoading = true;

    if (this.username === '' || !this.username) {
      this.mensagemErro('Informe o usuário');
      this.isLoading = false;

      return;
    }

    this.loginService.login('admin@kgepel.com.br', 'S@p1ens').subscribe({
      next: (res: any) => {
        const token = JSON.parse(res.jsonToken).access_token;

        this.newPassword = this.generatePassword();

        this.loginService.getUser(this.username, token).subscribe({
          next: (response: Usuario) => {
            this.user = response;
            this.email = response.email;

            this.loginService
              .changePassword(this.username, this.newPassword, token)
              .subscribe({
                next: () => {
                  this.loginService
                    .updateUser(this.user, this.newPassword, token)
                    .subscribe({
                      next: (res) => {
                        this.loginService
                          .sendEmail(this.user.email, this.newPassword)
                          .subscribe({
                            next: (res) => {
                              if (res.codRet === 0) {
                                this.success = true;
                              } else {
                                this.mensagemErro(
                                  'Não foi possível enviar o e-mail'
                                );
                              }
                            },
                            error: (err) => {
                              if (err.error.message) {
                                this.mensagemErro(err.error.message);
                              } else {
                                this.mensagemErro(
                                  'Serviço indisponível, tente novamente mais tarde!'
                                );
                              }
                            },
                          });
                      },
                      error: (err) => {
                        if (err.error.message) {
                          this.mensagemErro(err.error.message);
                        } else {
                          this.mensagemErro(
                            'Serviço indisponível, tente novamente mais tarde!'
                          );
                        }
                      },
                      complete: () => {
                        this.isLoading = false;
                      },
                    });
                },
              });
          },
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

        this.isLoading = false;
      },
    });
  }

  generatePassword() {
    // Definir os possíveis caracteres para cada tipo
    var letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
    var numeros = '0123456789';
    var caracteresEspeciais = '!@#$%^&*';

    // Definir o comprimento mínimo e máximo da senha
    var min = 6;
    var max = 20;

    // Gerar um comprimento aleatório entre o mínimo e o máximo
    var comprimento = Math.floor(Math.random() * (max - min + 1)) + min;

    // Inicializar a senha como uma string vazia
    var senha = '';

    // Escolher um caractere aleatório de cada tipo e adicioná-lo à senha
    senha += letrasMaiusculas.charAt(
      Math.floor(Math.random() * letrasMaiusculas.length)
    );
    senha += letrasMinusculas.charAt(
      Math.floor(Math.random() * letrasMinusculas.length)
    );
    senha += numeros.charAt(Math.floor(Math.random() * numeros.length));
    senha += caracteresEspeciais.charAt(
      Math.floor(Math.random() * caracteresEspeciais.length)
    );

    // Preencher o restante da senha com caracteres aleatórios de todos os tipos
    var todosCaracteres =
      letrasMaiusculas + letrasMinusculas + numeros + caracteresEspeciais;
    for (var i = senha.length; i < comprimento; i++) {
      senha += todosCaracteres.charAt(
        Math.floor(Math.random() * todosCaracteres.length)
      );
    }

    // Retornar a senha gerada
    return senha;
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
