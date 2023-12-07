import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario, UsuarioRegistro } from '../types/Usuario';
import ValidarDocumento from '../types/validarDocumento';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(usuario: string, senha: string): Observable<Object> {
    const data = {
      username: usuario,
      password: senha,
    };

    return this.http.post<Object>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/authentication/actions/login',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getUser(usuario: string, token: string): Observable<Usuario> {
    const data = {
      username: usuario,
      includePhoto: false,
    };

    return this.http.post<Usuario>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/user/queries/getUser',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      }
    );
  }

  validarDocumento(
    documento: string,
    tipoDocumento: string,
    email: string
  ): Observable<ValidarDocumento> {
    const data = {
      cgcCpf: documento,
      tipCli: tipoDocumento,
      email,
    };

    return this.http.post<ValidarDocumento>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ValidaCNPJ&useAlwaysArray=true',
      data,
      {
        headers: {
          user: 'suporte',
          pass: '@98fm',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  createUser(usuario: UsuarioRegistro): Observable<{ username: string }> {
    const data = {
      username: usuario.loginUsuario,
      fullName: `${usuario.nome} ${usuario.sobrenome}`,
      email: usuario.email,
      password: usuario.senha,
      blocked: false,
      changePassword: false,
      allowedToChangePassword: false,
      properties: [
        {
          name: 'codcli',
          value: usuario.codCli,
        },
      ],
    };

    return this.http.post<{ username: string }>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/user/queries/createUser',
      data,
      {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  redefinirSenha(
    usuario: string,
    tokenTemporario: string,
    senha: string
  ): Observable<Object> {
    const data = {
      username: `${usuario}@prisma-demo.com.br.seniorx`,
      temporaryToken: tokenTemporario,
      newPassword: senha,
    };

    return this.http.post<Object>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/authentication/actions/loginWithResetPassword',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  changePassword(username: string, newPassword: string, token: string) {
    const data = {
      username: username,
      newPassword: newPassword,
    };

    return this.http.post<{ username: string }>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/user/queries/changePassword',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  sendEmail(email: string, newPassword: string) {
    const data = {
      destinatario: email,
      novaSenha: newPassword,
    };

    return this.http.post<ValidarDocumento>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=EnviaEmailTrocaSenha&useAlwaysArray=true',
      data,
      {
        headers: {
          user: 'suporte',
          pass: '@98fm',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  updateUser(
    user: Usuario,
    newPassword: string,
    token: string
  ): Observable<{ username: string }> {
    const data = {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      password: newPassword,
      blocked: false,
      changePassword: true,
      allowedToChangePassword: true,
      properties: user.properties,
    };

    return this.http.post<{ username: string }>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/user/queries/updateUser',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
