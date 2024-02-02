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
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ExportaTitulos&useAlwaysArray=true',
      body,
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

  baixarTitulos(boleto: Titulo): Observable<baixarTitulos> {
    const body = {
      codEmp: boleto.codEmp,
      codFil: boleto.codFil,
      codTpt: boleto.codTpt,
      numTit: boleto.numTit,
    };

    return this.http.post<baixarTitulos>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=BaixarBoleto&useAlwaysArray=true',
      body,
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
}
