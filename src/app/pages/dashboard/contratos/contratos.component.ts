import { Component } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ContratosService } from 'src/app/services/contratos.service';
import { ContratoCompra } from 'src/app/types/ExportaContratos';
import { Usuario } from '../../../types/Usuario';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { codCli ,codEmp, codFor } from 'src/app/services/inicio.service';


@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss'],
  providers: [MessageService],
})
export class ContratosComponent {
  contratoCompra: ContratoCompra[] = [];
  carregando: boolean = true;
  quantidadeLinhas: number = 10;
  totalRegistros: number = 0;
  valorInput: string = '';

  exportaContratos$!: Subscription;

  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );

  private codFor: codFor = {
    codFor: '',
  };



  constructor(
    private contratosService: ContratosService,
    private messageService: MessageService,
    private http: HttpClient,
    private router: Router
  ) {
    if (!this.usuario) {
      router.navigate(['login']);
    } else {
      this.usuario.properties.forEach((propriedade) => {
        const { name, value } = propriedade;

        if (name.toLowerCase() === 'codfor') {
          this.codFor = {
            codFor: value,
          };
        }
      });
    }
    this.exportaContratos();
  }

  exportaContratos() {
    this.exportaContratos$ = this.contratosService.ExportaContratos().subscribe((data) => {

      if (data.codRet === 0) {
        this.contratoCompra = data.contratos;
        this.totalRegistros = this.contratoCompra.length;
      } else {
        this.mensagemErro(data.msgRet);
      }

      this.carregando = false;
    });
  }

  currencyFormatter(valor: number): string {
    const valorFormatado = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return valorFormatado;
  }

  ordenar(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;

      if (event.field === 'datAut') {
        value1 = value1.split('/').reverse().join('/');
        value2 = value2.split('/').reverse().join('/');
      }

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return event.order! * result;
    });
  }

  mensagemErro(mensagem: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  clear(table: Table) {
    table.clear();
    table._filter();
  }

  ngOnDestroy() {
    if (this.exportaContratos$) {
      this.exportaContratos$.unsubscribe();
    }
  }
}
