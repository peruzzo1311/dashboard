import { Component } from '@angular/core';
import * as JSZip from 'jszip';
import { MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription, forkJoin } from 'rxjs';
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
  downloadOptions: MenuItem[] | undefined;

  exportaNotas$!: Subscription;
  baixarNotas$!: Subscription;

  constructor(
    private notasService: NotasService,
    private messageService: MessageService
  ) {
    this.exportaNotas();
  }

  exportaNotas() {
    this.exportaNotas$ = this.notasService.exportaNotas().subscribe({
      next: (data) => {
        if (data.codRet === 0) {
          if (!Array.isArray(data.notas)) {
            data.notas = [data.notas];
          }

          this.notas = data.notas;
          this.totalRegistros = data.notas.length;
        } else {
          this.mensagemErro(data.msgRet);
        }

        this.carregando = false;
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );
        }

        this.carregando = false;
      },
    });
  }

  baixarNota(nota: Nota, label: string) {
    switch (label) {
      case 'pdf':
        this.baixarNotas(nota);
        break;
      case 'xml':
        this.baixarNotasXML(nota);
        break;
      case 'pdf e xml':
        this.baixarNotas(nota);
        this.baixarNotasXML(nota);
        break;
    }
  }

  baixarNotas(nota: Nota) {
    nota.baixando = true;

    this.baixarNotas$ = this.notasService.baixarNotas(nota).subscribe({
      next: (data) => {
        if (data.codRet === 0) {
          this.base64ParaPdf(data.pdfNfe, `nota_${nota.numNfv}.pdf`);
        } else {
          this.mensagemErro(data.msgRet);
        }

        nota.baixando = false;
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );
        }

        nota.baixando = false;
      },
    });
  }

  baixarNotasXML(nota: Nota) {
    nota.baixando = true;

    this.notasService.baixarNotasXML(nota).subscribe({
      next: (data) => {
        if (data.codRet === 0) {
          this.base64ParaXml(data.xmlNfe[0].string, `nota_${nota.numNfv}.xml`);
        } else {
          this.mensagemErro(data.msgRet);
        }

        nota.baixando = false;
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );
        }

        nota.baixando = false;
      },
    });
  }

  baixarMultiplasNotas() {
    this.carregando = true;
    const zip = new JSZip();
    let requests = [];

    for (let nota of this.notasSelecionadas) {
      requests.push(this.notasService.baixarNotas(nota));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((data, index) => {
          const nota = this.notasSelecionadas[index];

          if (data && data.pdfNfe) {
            zip.file(`nota_${nota.numNfv}.pdf`, data.pdfNfe, {
              base64: true,
            });
          } else {
            this.mensagemErro('Erro ao baixar nota.');
          }
        });

        zip.generateAsync({ type: 'blob' }).then((content) => {
          const link = document.createElement('a');

          link.href = URL.createObjectURL(content);
          link.download = 'pdf_notas.zip';
          link.click();
        });

        this.notasSelecionadas = [];
        requests = [];
        this.carregando = false;
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );
        }

        this.notasSelecionadas = [];
        requests = [];
        this.carregando = false;
      },
    });
  }

  baixarMultiplasNotasXML() {
    this.carregando = true;
    const zip = new JSZip();
    let requests = [];

    for (let nota of this.notasSelecionadas) {
      requests.push(this.notasService.baixarNotasXML(nota));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((data, index) => {
          const nota = this.notasSelecionadas[index];

          if (data && data.xmlNfe) {
            zip.file(`nota_${nota.numNfv}.xml`, data.xmlNfe[0].string, {
              base64: true,
            });
          } else {
            this.mensagemErro('Erro ao baixar nota.');
          }
        });

        zip.generateAsync({ type: 'blob' }).then((content) => {
          const link = document.createElement('a');

          link.href = URL.createObjectURL(content);
          link.download = 'xml_notas.zip';
          link.click();
        });

        this.notasSelecionadas = [];
        requests = [];
        this.carregando = false;
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );
        }

        this.carregando = false;
      },
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

  base64ParaXml(base64: string, fileName: string) {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/xml' });
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

  currencyFormatter(valor: number): string {
    const valorFormatado = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return valorFormatado;
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
