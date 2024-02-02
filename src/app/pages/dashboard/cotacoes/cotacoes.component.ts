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

import { CotacoesService } from 'src/app/services/cotacoes.service';

@Component({
  selector: 'app-cotacoes',
  templateUrl: './cotacoes.component.html',
  styleUrls: ['./cotacoes.component.scss'],
  providers: [MessageService, CotacoesService],
})
export class CotacoesComponent {
  qtdAnosAnteriores = 14;
  years: number[] = [];
  currentYear: number = new Date().getFullYear();;
  selectedYear!: number;
  dataForSelectedYear: any[] = [];
  tableData: any[] = [];
  cols: any[] = [];

  carregando: boolean = true;
  quantidadeLinhas: number = 15;
  totalRegistros: number = 0;
  valorInput: string = '';

  exportaCotacoes$!: Subscription;

  private usuario: Usuario = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );

  private codCli: codCli = {
    codCli: '',
  };

  private codEmp: codEmp = {
    codEmp: '',
  };

  private codFor: codFor = {
    codFor: '',
  };

  constructor(
    private contratosService: ContratosService,
    private messageService: MessageService,
    private cotacoesService: CotacoesService,
    private http: HttpClient,
    private router: Router
  ) {
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
        if (name.toLowerCase() === 'codfor') {
          this.codFor = {
            codFor: value,
          };
        }
      });
    }
  }

  ngOnInit() {
    this.cols = [
      { field: 'codMoe', header: 'Código Moeda' },
      { field: 'desMoe', header: 'Descrição' },
      { field: 'datGer', header: 'Data Geração' },
      { field: 'datMoe', header: 'Data Moeda' },
      { field: 'vlrPre', header: 'Valor Preço' },
      { field: 'vlrCot', header: 'Valor Cotação' }
    ];

    this.initializeYears();
    this.selectedYear = this.currentYear; // Inicializa com o ano atual
    this.loadDataForYear(this.selectedYear);
  }

  initializeYears() {
    for (let year = this.currentYear; year >= this.currentYear - this.qtdAnosAnteriores; year--) {
      this.years.push(year);
    }
  }

  onTabChange(event: any) {
    this.selectedYear = this.years[event.index];
    this.carregando = true;
    this.loadDataForYear(this.selectedYear);
  }

  loadDataForYear(year: number) {
    // Data de início do ano (1 de Janeiro)
    const startDate = new Date(year, 0, 1); // 0 é Janeiro
    // Data de fim do ano (31 de Dezembro)
    const endDate = new Date(year, 11, 31); // 11 é Dezembro

    // Formata as datas no formato DD/MM/YYYY
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    this.exportaCotacoes$ = this.cotacoesService.ExportaCotacoes(formattedStartDate, formattedEndDate).subscribe((data) => {
      console.log("🚀 ~ data:", data);
      if (data.codRet === 0) {
        console.log("🚀 ~ data.cotacoes:", data.cotacoes);

        this.dataForSelectedYear = data.cotacoes;
        this.totalRegistros = data.cotacoes.length;
      } else {
        this.mensagemErro(data.msgRet);
        this.dataForSelectedYear = []
      }

      this.carregando = false;
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
    if (this.exportaCotacoes$) {
      this.exportaCotacoes$.unsubscribe();
    }
  }
}
