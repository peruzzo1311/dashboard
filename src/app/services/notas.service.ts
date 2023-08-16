import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Usuario from '../types/Usuario';
import { clientesObras } from './inicio.service';
import exportaNotas, { Nota } from '../types/exportaNotas';
import { Observable } from 'rxjs';
import baixarNotas from '../types/baixarNotas';

@Injectable({
  providedIn: 'root',
})
export class NotasService {
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

  exportaNotas(): Observable<exportaNotas> {
    const body = {
      clientesObras: this.clientesObras,
    };

    return this.http.post<exportaNotas>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=ExportaNotas&useAlwaysArray=true',
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

  baixarNotas(nota: Nota): Observable<baixarNotas> {
    const body = {
      codEmp: nota.codEmp,
      codFil: nota.codFil,
      codSnf: nota.codSnf,
      numNfv: nota.numNfv,
    };

    return this.http.post<baixarNotas>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=BaixarDanfse&useAlwaysArray=true',
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
