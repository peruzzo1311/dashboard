import { Component } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { RomaneiosService } from 'src/app/services/romaneios.service';
import { Romaneio } from 'src/app/types/ExportaRomaneios';

@Component({
  selector: 'app-romaneios',
  templateUrl: './romaneios.component.html',
  styleUrls: ['./romaneios.component.scss'],
  providers: [MessageService],
})
export class RomaneiosComponent {
  romaneios: Romaneio[] = [];
  carregando: boolean = true;
  quantidadeLinhas: number = 10;
  totalRegistros: number = 0;
  valorInput: string = '';

  exportaRomaneios$!: Subscription;


  constructor(
    private romaneiosService: RomaneiosService,
    private messageService: MessageService
  ) {
    this.exportaRomaneios();
  }

  exportaRomaneios() {
    this.exportaRomaneios$ = this.romaneiosService.ExportaRomaneios().subscribe((data) => {
      if (data.codRet === 0) {
        console.log(data.romaneios)
        this.romaneios = data.romaneios;
        this.totalRegistros = data.romaneios.length;
      } else {
        this.mensagemErro(data.msgRet);
      }

      this.carregando = false;
    });
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
    if (this.exportaRomaneios$) {
      this.exportaRomaneios$.unsubscribe();
    }
  }
}
