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
    tipoDocumento: string
  ): Observable<ValidarDocumento> {
    const data = {
      cgcCpf: documento,
      tipCli: tipoDocumento,
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
    const data = {
      username: `${usuario.nome}.${usuario.sobrenome}`,
      fullName: `${usuario.nome} ${usuario.sobrenome}`,
      email: `${usuario.nome}.${usuario.sobrenome}@kgepel.com.br`,
      password: usuario.senha,
      description: '',
      blocked: false,
      changePassword: false,
      locale: '',
      properties: [
        {
          name: 'codCli',
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
}
