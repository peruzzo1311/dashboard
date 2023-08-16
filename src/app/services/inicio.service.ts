import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Usuario from '../types/Usuario';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import ConsultaVolumeMes from '../types/consultaVolumeMes';
import ConsultaValorFaturadoMes from '../types/consultaValorFaturadoMes';
import ExportaVolumeMeses from '../types/exportaVolumeMeses';
import ExportaVolumeObrasMes from '../types/exportaVolumeObrasMes';

export interface clientesObras {
  clienteObra: string;
}

@Injectable({
  providedIn: 'root',
})
export class InicioService {
  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );
  private clientesObras: clientesObras[] = [];

  constructor(private http: HttpClient, private router: Router) {
    if (!this.usuario) {
      router.navigate(['/login']);
    } else {
      this.clientesObras = this.usuario.properties.map((item) => {
        const { name, value } = item;

        if (value.toLowerCase() == 'todas') {
          return {
            clienteObra: item.name,
          };
        } else {
          return {
            clienteObra: `${name}-${value}`,
          };
        }
      });
    }
  }

  consultaVolumeMes(): Observable<ConsultaVolumeMes> {
    const body = {
      clientesObras: this.clientesObras,
    };

    return this.http.post<ConsultaVolumeMes>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=ConsultaVolumeMes&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'integracao.portal',
          pass: 'ConCrEp0Rt@l',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  consultaValorFaturadoMes(): Observable<ConsultaValorFaturadoMes> {
    const body = {
      clientesObras: this.clientesObras,
    };

    return this.http.post<ConsultaValorFaturadoMes>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=ConsultaValorFaturadoMes&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'integracao.portal',
          pass: 'ConCrEp0Rt@l',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  exportaVolumesMeses(): Observable<ExportaVolumeMeses> {
    const body = {
      clientesObras: this.clientesObras,
    };

    return this.http.post<ExportaVolumeMeses>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=ExportaVolumesMeses&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'integracao.portal',
          pass: 'ConCrEp0Rt@l',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  exportaVolumeObrasMes(): Observable<ExportaVolumeObrasMes> {
    const body = {
      clientesObras: this.clientesObras,
    };

    return this.http.post<ExportaVolumeObrasMes>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=ExportaVolumeObrasMes&useAlwaysArray=true',
      body,
      {
        headers: {
          user: 'integracao.portal',
          pass: 'ConCrEp0Rt@l',
          encryptionType: '0',
          Authorization: '',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
