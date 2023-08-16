import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Usuario from '../types/Usuario';
import { clientesObras } from './inicio.service';
import { Router } from '@angular/router';
import ExportaTitulos, { Titulo } from '../types/exportaTitulos';
import { Observable } from 'rxjs';
import baixarTitulos from '../types/baixarTitulos';

@Injectable({
  providedIn: 'root',
})
export class BoletosService {
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

  exportaTitulos(): Observable<ExportaTitulos> {
    const body = {
      clientesObras: this.clientesObras,
    };

    return this.http.post<ExportaTitulos>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=ExportaTitulos&useAlwaysArray=true',
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

  baixarTitulos(boleto: Titulo): Observable<baixarTitulos> {
    const body = {
      codEmp: boleto.codEmp,
      codFil: boleto.codFil,
      codTpt: boleto.codTpt,
      numTit: boleto.numTit,
    };

    return this.http.post<baixarTitulos>(
      'https://concresuper.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.portal&port=BaixarBoleto&useAlwaysArray=true',
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
