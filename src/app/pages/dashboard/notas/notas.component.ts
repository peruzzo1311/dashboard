import { Component } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { NotasService } from 'src/app/services/notas.service';
import { Nota } from 'src/app/types/exportaNotas';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss'],
  providers: [MessageService],
})
export class NotasComponent {
  notas: Nota[] = [];
  carregando: boolean = true;
  quantidadeLinhas: number = 10;
  totalRegistros: number = 0;
  notasSelecionadas: Nota[] = [];
  valorInput: string = '';

  exportaNotas$!: Subscription;
  baixarNotas$!: Subscription;

  constructor(
    private notasService: NotasService,
    private messageService: MessageService
  ) {
    this.exportaNotas();
  }

  exportaNotas() {
    this.exportaNotas$ = this.notasService.exportaNotas().subscribe((data) => {
      if (data.codRet === 0) {
        this.notas = data.notas;
        this.totalRegistros = data.notas.length;
      } else {
        this.mensagemErro(data.msgRet);
      }

      this.carregando = false;
    });
  }

  baixarNotas(nota: Nota) {
    nota.baixando = true;

    this.baixarNotas$ = this.notasService
      .baixarNotas(nota)
      .subscribe((data) => {
        if (data.codRet === 0) {
          this.base64ParaPdf(data.pdfNfe, `Nota_${nota.numNfv}`);
        } else {
          this.mensagemErro(data.msgRet);
        }

        nota.baixando = false;
      });
  }

  baixarMultiplasNotas() {
    // if (this.notasSelecionadas.length === 0) {
    //   this.mensagemErro('Nenhuma nota selecionada!');

    //   return;
    // } else {
    //   this.notasSelecionadas.forEach((nota) => {
    //     this.baixarNotas(nota);
    //   });
    // }
    console.log(this.notasSelecionadas);
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
  }

  ngOnDestroy() {
    if (this.exportaNotas$) {
      this.exportaNotas$.unsubscribe();
    }

    if (this.baixarNotas$) {
      this.baixarNotas$.unsubscribe();
    }
  }
}
