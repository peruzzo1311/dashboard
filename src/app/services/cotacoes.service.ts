import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import ExportaCotacoes from '../types/ExportaCotacoes';

import { Usuario } from '../types/Usuario';
import { codCli, codEmp, codFil, codFor } from './inicio.service';

@Injectable({
  providedIn: 'root',
})
export class CotacoesService {
  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );
  private codCli: codCli = {
    codCli: '',
  };
  private codEmp: codEmp = {
    codEmp: '',
  };

  private codFil: codFil = {
    codFil: '',
  };

  private codFor: codFor = {
    codFor: '',
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
        if (name.toLowerCase() === 'codfil') {
          this.codFil = {
            codFil: value,
          };
        }
        if (name.toLowerCase() === 'codfor') {
          this.codFor = {
            codFor: value,
          };
        }
      });
    }
  }

  ExportaCotacoes(datIni: string = this.obterDataAtualFormatada(), datFim: string = this.obterDataAtualFormatada()): Observable<ExportaCotacoes> {
    datIni = datIni || this.obterDataAtualFormatada();
    datFim = datFim || this.obterDataAtualFormatada();

    const body = {
      dataInicio: datIni,
      dataFim: datFim,
      codEmp: this.codEmp.codEmp,
      codFil: this.codFil.codFil,
      codFor: this.codFor.codFor,
    };

    return this.http.post<ExportaCotacoes>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.romaneios&port=RetornaCotacoes&useAlwaysArray=true',
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

  obterDataAtualFormatada() {
    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    var ano = data.getFullYear();

    return dia + '/' + mes + '/' + ano;
  }
}
