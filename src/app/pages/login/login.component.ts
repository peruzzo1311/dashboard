import { Component } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { Usuario, UsuarioRegistro } from 'src/app/types/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, MessageService],
})
export class LoginComponent {
  title = 'dashboard';
  carregando = false;
  mostrarSenha = false;

  //modal registro
  formulario!: NgForm;
  tipoDocumento: 'CPF' | 'CNPJ' = 'CPF';
  documento: string = '';
  emailRegistro: string = '';
  codCli: number = 0;
  documentoVerificado = false;
  validandoDocumento = false;
  mostrarMenuRegistro = false;
  mostrarSenhaRegistro = false;
  mostrarConfirmarSenha = false;
  usuarioCriado = false;

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

  login$!: Subscription;
  getUser$!: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    if (sessionStorage.getItem('usuario')) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  fecharMenuRegistro() {
    this.mostrarMenuRegistro = false;

    this.documento = '';
    this.emailRegistro = '';
    this.codCli = 0;
    this.documentoVerificado = false;
    this.validandoDocumento = false;
    this.tipoDocumento = 'CPF';
    this.usuarioCriado = false;
    this.formularioCadastro.reset();
  }

  verificarDocumento() {
    const documento = this.documento.replace(/\D/g, '');
    const tipoDocumento = this.tipoDocumento === 'CPF' ? 'F' : 'J';

    if (documento && this.emailRegistro) {
      this.validandoDocumento = true;

      this.loginService.validarDocumento(documento, tipoDocumento).subscribe({
        next: (res) => {
          if (res.codRet === 0) {
            this.codCli = res.codCli;

            this.documentoVerificado = true;
          } else {
            this.mensagemErro(res.msgRet);
          }
        },
        error: (err) => {
          this.mensagemErro(
            'Serviço indisponível, tente novamente mais tarde!'
          );
        },
        complete: () => (this.validandoDocumento = false),
      });
    } else {
      this.mensagemErro('Preencha os campos corretamente!');
    }
  }

  formSubmit() {
    const usuarioRegistro: UsuarioRegistro = {
      nome: this.nome?.value,
      sobrenome: this.sobrenome?.value,
      email: this.emailRegistro,
      senha: this.senhaRegistro?.value,
      codCli: this.codCli,
      documento: this.documento,
      token: '',
    };

    this.loginService.createUser(usuarioRegistro).subscribe({
      next: (res) => {},
      error: (err) => {
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
