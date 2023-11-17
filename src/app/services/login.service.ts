import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRegistro } from '../types/Usuario';
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

  getUser(usuario: string, token: string): Observable<Object> {
    const data = {
      username: usuario,
      includePhoto: false,
    };

    return this.http.post<Object>(
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
      'https://sistema.kgepel.com.br/API/G5Rest?server=https://sistema.kgepel.com.br&module=sapiens&port=ValidaCNPJ&useAlwaysArray=true&service=com.prisma.portal.faturas',
      data,
      {
        headers: {
          user: 'joao.dayko',
          pass: '102030',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  createUser(usuario: UsuarioRegistro): Observable<{ username: string }> {
    const username = `${usuario
      .nome!.trim()
      .split(' ')[0]
      .toLowerCase()}.${usuario.sobrenome!.trim().split(' ')[0].toLowerCase()}`;

    const data = {
      username: username,
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
      username: `${usuario}@kgepel.com.br`,
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
}
