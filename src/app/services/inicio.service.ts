import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ExportaPagamentos } from '../types/ExportaPagamentos';
import ExportaPagamentosPeriodo from '../types/ExportaPagamentosPeriodo';
import { Usuario } from '../types/Usuario';
import ConsultaValorFaturadoMes from '../types/consultaValorFaturadoMes';
import consultaValorFaturadoMesAnterior from '../types/consultaValorFaturadoMesAnterior';

export interface codCli {
  codCli: string | number;
}
export interface codEmp {
  codEmp: string | number;
}
export interface codFil {
  codFil: string | number;
}

export interface codFor {
  codFor: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class InicioService {
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
      router.navigate(['login']);
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

  consultaValorFaturadoMesAnterior(): Observable<consultaValorFaturadoMesAnterior> {
    const body = this.codCli;

    return this.http.post<consultaValorFaturadoMesAnterior>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ExportaFaturasMesAnterior&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'suporte',
          pass: '@98fm',
          EncryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  consultaValorFaturadoMes(): Observable<ConsultaValorFaturadoMes> {
    const body = this.codCli;

    return this.http.post<ConsultaValorFaturadoMes>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ExportaFaturasMesAtual&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'suporte',
          pass: '@98fm',
          EncryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  ExportaPagamentos(): Observable<ExportaPagamentos> {
    const body = this.codCli;

    return this.http.post<ExportaPagamentos>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ExportaPagamentos6&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'suporte',
          pass: '@98fm',
          EncryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  ExportaPagamentosPeriodo(): Observable<ExportaPagamentosPeriodo> {
    const body = this.codCli;

    return this.http.post<ExportaPagamentosPeriodo>(
      'https://demonstra.prismainformatica.com.br:8188/SXI/G5Rest?server=https://demonstra.prismainformatica.com.br:8188&module=sapiens&service=com.prisma.portal.faturas&port=ExportaPagamentosPeriodo&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'suporte',
          pass: '@98fm',
          EncryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
