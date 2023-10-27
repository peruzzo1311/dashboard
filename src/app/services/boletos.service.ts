import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Usuario } from '../types/Usuario';
import baixarTitulos from '../types/baixarTitulos';
import ExportaTitulos, { Titulo } from '../types/exportaTitulos';
import { codCli } from './inicio.service';

@Injectable({
  providedIn: 'root',
})
export class BoletosService {
  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );
  private codCli: codCli = {
    codCli: '',
  };

  constructor(private http: HttpClient, private router: Router) {
    if (!this.usuario) {
      router.navigate(['login']);
    } else {
      this.usuario.properties.forEach((propriedade) => {
        const { name, value } = propriedade;

        if (name.toLowerCase() === 'codcli') {
          this.codCli = {
            codCli: value,
          };
        }
      });
    }
  }

  exportaTitulos(): Observable<ExportaTitulos> {
    const body = this.codCli;

    return this.http.post<ExportaTitulos>(
      'https://sistema.kgepel.com.br/API/G5Rest?server=https://sistema.kgepel.com.br&module=sapiens&port=ExportaTitulos&useAlwaysArray=true&service=com.prisma.portal.faturas',
      body,
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

  baixarTitulos(boleto: Titulo): Observable<baixarTitulos> {
    const body = {
      codEmp: boleto.codEmp,
      codFil: boleto.codFil,
      codTpt: boleto.codTpt,
      numTit: boleto.numTit,
    };

    return this.http.post<baixarTitulos>(
      'https://sistema.kgepel.com.br/API/G5Rest?server=https://sistema.kgepel.com.br&module=sapiens&service=com.prisma.portal.faturas&port=BaixarBoleto&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'joao.dayko',
          pass: '102030',
          EncryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
