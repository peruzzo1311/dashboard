import { Component } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { FaturasService } from 'src/app/services/faturas.service';
import { Fatura, Nota } from 'src/app/types/exportaFaturas';

@Component({
  selector: 'app-faturas',
  templateUrl: './faturas.component.html',
  styleUrls: ['./faturas.component.scss'],
  providers: [MessageService],
})
export class FaturasComponent {
  faturas: Fatura[] = [];
  quantidadeLinhas: number = 10;
  totalRegistros: number = 0;
  carregando: boolean = true;
  valorInput: string = '';

  constructor(
    private faturasService: FaturasService,
    private messageService: MessageService
  ) {
    this.exportaFaturas();
  }

  exportaFaturas() {
    this.faturasService.exportaFaturas().subscribe((data) => {
      if (data.codRet === 0) {
        this.faturas = data.faturas;
        this.totalRegistros = this.faturas.length;

        this.faturas.forEach((fatura) => {
          fatura.notas = Array.isArray(fatura.notas)
            ? fatura.notas
            : [fatura.notas];

          const valorTotal = fatura.notas.reduce(
            (acc, nota) => acc + nota.vlrLiq,
            0
          );

          fatura.vlrTot = valorTotal;
        });

        console.log(this.faturas);
      } else {
        this.mensagemErro(data.msgRet);
      }

      this.carregando = false;
    });
  }

  baixarFatura(fatura: Fatura) {
    fatura.baixando = true;

    this.faturasService.baixarFaturas(fatura).subscribe((data) => {
      if (data.codRet === 0) {
        this.base64ParaPdf(data.pdfFat, `Fatura_${fatura.numNff}`);
      } else {
        this.mensagemErro(data.msgRet);
      }

      fatura.baixando = false;
    });
  }

  baixarNota(nota: Nota) {
    nota.baixando = true;

    this.faturasService.baixarNota(nota).subscribe((data) => {
      if (data.codRet === 0) {
        this.base64ParaPdf(data.pdfNfs, `Nota_${nota.numNfv}`);
      } else {
        this.mensagemErro(data.msgRet);
      }

      nota.baixando = false;
    });
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
  }
}
