import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import ExportaContratos from '../types/ExportaContratos';

import { Usuario } from '../types/Usuario';
import { codCli, codEmp } from './inicio.service';

@Injectable({
  providedIn: 'root',
})
export class ContratosService {
  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );
  private codCli: codCli = {
    codCli: '',
  };

  private codEmp: codEmp = {
    codEmp: '',
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

        if (name.toLowerCase() === 'codemp') {
          this.codEmp = {
            codEmp: value,
          };
        }
      });
    }
  }

  ExportaContratos(): Observable<ExportaContratos> {
    const body = {
      codEmp: this.codEmp.codEmp,
      codFil: this.codCli.codCli,
      identificadorSistema: 'BPM',
    };


    return this.http.post<ExportaContratos>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.senior.g5.co.mcm.cpr.contratocompra&port=ConsultarGeral&useAlwaysArray=true',
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
