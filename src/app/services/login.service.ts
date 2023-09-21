import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
