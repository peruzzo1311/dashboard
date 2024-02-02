import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Usuario } from '../types/Usuario';
import { baixarNotas, baixarNotasXML } from '../types/baixarNotas';
import exportaNotas, { Nota } from '../types/exportaNotas';
import { codCli } from './inicio.service';

@Injectable({
  providedIn: 'root',
})
export class NotasService {
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

  exportaNotas(): Observable<exportaNotas> {
    const body = this.codCli;

    return this.http.post<exportaNotas>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ExportaNotas&useAlwaysArray=true',
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

  baixarNotas(nota: Nota): Observable<baixarNotas> {
    const body = {
      codEmp: nota.codEmp,
      codFil: nota.codFil,
      codSnf: nota.codSnf,
      numNfv: nota.numNfv,
    };

    return this.http.post<baixarNotas>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=BaixarDanfe&useAlwaysArray=true',
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

  baixarNotasXML(nota: Nota): Observable<baixarNotasXML> {
    const body = {
      codEmp: nota.codEmp,
      codFil: nota.codFil,
      codSnf: nota.codSnf,
      numNfv: nota.numNfv,
    };

    return this.http.post<baixarNotasXML>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=BaixarXml&useAlwaysArray=true',
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
