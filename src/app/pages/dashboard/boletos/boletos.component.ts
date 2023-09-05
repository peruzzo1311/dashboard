import { Component } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { BoletosService } from 'src/app/services/boletos.service';
import { Titulo } from 'src/app/types/exportaTitulos';

@Component({
  selector: 'app-boletos',
  templateUrl: './boletos.component.html',
  styleUrls: ['./boletos.component.scss'],
  providers: [MessageService],
})
export class BoletosComponent {
  boletos: Titulo[] = [];
  boletosSelecionados: Titulo[] = [];
  quantidadeLinhas: number = 10;
  totalRegistros: number = 0;
  carregando: boolean = true;
  valorInput: string = '';

  exportaTitulos$!: Subscription;
  baixarTitulos$!: Subscription;

  constructor(
    private boletosService: BoletosService,
    private messageService: MessageService
  ) {
    this.exportaTitulos();
  }

  exportaTitulos() {
    this.exportaTitulos$ = this.boletosService
      .exportaTitulos()
      .subscribe((data) => {
        if (data.codRet === 0) {
          this.boletos = data.titulos;
          this.totalRegistros = this.boletos.length;
        } else {
          this.mensagemErro(data.msgRet);
        }

        this.carregando = false;
      });
  }

  baixarTitulos(boleto: Titulo) {
    boleto.baixando = true;

    this.baixarTitulos$ = this.boletosService
      .baixarTitulos(boleto)
      .subscribe((data) => {
        if (data.codRet === 0) {
          this.base64ParaPdf(data.pdfBol, `boleto_${boleto.numTit}.pdf`);
        } else {
          this.mensagemErro(data.msgRet);
        }

        boleto.baixando = false;
      });
  }

  baixarMultiplosTitulos() {
    if (this.boletosSelecionados.length === 0) {
      this.mensagemErro('Nenhum título selecionado!');

      return;
    } else {
      this.boletosSelecionados.forEach((boleto) => {
        this.baixarTitulos(boleto);
      });
    }
  }

  base64ParaPdf(base64: string, fileName: string) {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
      const link = document.createElement('a');

      link.href = URL.createObjectURL(pdfBlob);
      link.download = fileName;
      link.click();

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${fileName} baixado com sucesso!`,
      });

      setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } catch (erro: any) {
      console.log(erro);

      this.mensagemErro(erro.message);
    }
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

  ordenar(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;

      if (event.field === 'datGer') {
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

  clear(table: Table) {
    table.clear();
  }

  currencyFormatter(valor: number): string {
    const valorFormatado = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return valorFormatado;
  }

  ngOnDestroy() {
    if (this.exportaTitulos$) {
      this.exportaTitulos$.unsubscribe();
    }

    if (this.baixarTitulos$) {
      this.baixarTitulos$.unsubscribe();
    }
  }
}
