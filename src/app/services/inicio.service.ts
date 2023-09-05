import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import ContasPagar from '../types/ContasPagar';
import Usuario from '../types/Usuario';
import ConsultaValorFaturadoMes from '../types/consultaValorFaturadoMes';
import consultaValorFaturadoMesAnterior from '../types/consultaValorFaturadoMesAnterior';

export interface codCli {
  codCli: string | number;
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

  ContasPagar(): Observable<ContasPagar> {
    const body = {
      context: {
        PREVENT_DATASET_EXCEPTION: true,
      },
      displayBlock: false,
      filters: [],
      id: 'dataset://factory/default/erpxt/analytics/financial_pay_graph',
    };

    return this.http.post<ContasPagar>(
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/dataset/queries/executeDataset',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.usuario.token,
        },
      }
    );
  }
}
