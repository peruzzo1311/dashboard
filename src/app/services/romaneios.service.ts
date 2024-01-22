import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import ExportaRomaneios from '../types/ExportaRomaneios';

import { Usuario } from '../types/Usuario';
import { codCli } from './inicio.service';

@Injectable({
  providedIn: 'root',
})
export class RomaneiosService {
  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );
  private codCli: codCli = {
    codCli: '',
  };

  constructor(private http: HttpClient, private router: Router) {
    if (!this.usuario) {
      router.navigate(['/login']);
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

  ExportaRomaneios(): Observable<ExportaRomaneios> {
    const body = {
      codEmp: '5',
      codFil: '1',
      codFor: '1',
    };

    return this.http.post<ExportaRomaneios>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.romaneios&port=RetornaRomaneios&UseAlwaysArrray=true',
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
