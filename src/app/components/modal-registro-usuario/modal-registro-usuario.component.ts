import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioRegistro } from 'src/app/types/Usuario';

@Component({
  selector: 'app-modal-registro-usuario',
  templateUrl: './modal-registro-usuario.component.html',
  styleUrls: ['./modal-registro-usuario.component.scss'],
  providers: [FormBuilder, LoginService, MessageService],
})
export class ModalRegistroUsuarioComponent {
  tipoDocumento: 'CPF' | 'CNPJ' = 'CPF';
  documento: string = '';
  emailRegistro: string = '';
  codCli: number = 0;

  loginUsuario: string = '';
  validandoDocumento = false;
  cadastrando = false;

  mostrarMenuRegistro = false;
  mostrarEtapa1 = true;
  mostrarEtapa2 = false;
  mostrarEtapa3 = false;

  mostrarSenhaRegistro = false;
  mostrarConfirmarSenha = false;

  formularioCadastro = this.fb.group({
    nome: new FormControl('', Validators.required),
    sobrenome: new FormControl('', Validators.required),
    senhaRegistro: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$'
      ),
    ]),
    confirmarSenha: new FormControl('', [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  fecharMenuRegistro() {
    this.mostrarMenuRegistro = false;

    this.documento = '';
    this.emailRegistro = '';
    this.codCli = 0;

    this.cadastrando = false;
    this.validandoDocumento = false;
    this.tipoDocumento = 'CPF';
    this.mostrarEtapa1 = true;
    this.mostrarEtapa2 = false;
    this.mostrarEtapa3 = false;
    this.formularioCadastro.reset();
  }

  verificarDocumento() {
    const documento = this.documento.replace(/\D/g, '');
    const tipoDocumento = this.tipoDocumento === 'CPF' ? 'F' : 'J';

    if (documento && this.emailRegistro) {
      this.validandoDocumento = true;

      this.loginService
        .validarDocumento(documento, tipoDocumento, this.emailRegistro)
        .subscribe({
          next: (res) => {
            if (res.codRet === 0) {
              this.codCli = res.codCli;
              this.loginUsuario = res.userName.toLowerCase();

              this.mostrarEtapa1 = false;
              this.mostrarEtapa2 = true;
            } else {
              this.mensagemErro(res.msgRet);
            }
          },
          error: (err) => {
            this.mensagemErro(
              'Serviço indisponível, tente novamente mais tarde!'
            );

            this.validandoDocumento = false;
          },
          complete: () => (this.validandoDocumento = false),
        });
    } else {
      this.mensagemErro('Preencha os campos corretamente!');
    }
  }

  formSubmit() {
    this.cadastrando = true;

    this.loginService.login('admin@kgepel.com.br', 'S@p1ens').subscribe({
      next: (res: any) => {
        const token = JSON.parse(res.jsonToken).access_token;

        const usuarioRegistro: UsuarioRegistro = {
          nome: this.nome?.value,
          sobrenome: this.sobrenome?.value,
          loginUsuario: this.loginUsuario,
          email: this.emailRegistro,
          senha: this.senhaRegistro?.value,
          codCli: this.codCli,
          token: token,
        };

        this.loginService.createUser(usuarioRegistro).subscribe({
          next: (res) => {
            this.mostrarEtapa2 = false;
            this.mostrarEtapa3 = true;
          },
          error: (err) => {
            if (err.error.message) {
              this.mensagemErro(err.error.message);
            } else {
              this.mensagemErro(
                'Serviço indisponível, tente novamente mais tarde!'
              );
            }

            this.cadastrando = false;
          },
          complete: () => (this.cadastrando = false),
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
    });
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

  show() {
    this.mostrarMenuRegistro = true;
  }

  get nome() {
    return this.formularioCadastro.get('nome');
  }

  get sobrenome() {
    return this.formularioCadastro.get('sobrenome');
  }

  get senhaRegistro() {
    return this.formularioCadastro.get('senhaRegistro');
  }

  get confirmarSenha() {
    return this.formularioCadastro.get('confirmarSenha');
  }
}
