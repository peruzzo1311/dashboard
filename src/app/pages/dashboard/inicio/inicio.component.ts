import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, forkJoin, map } from 'rxjs';
import { InicioService } from 'src/app/services/inicio.service';

export interface ContasPagarPeriodo {
  label: string;
  value: number;
}

export interface Card {
  titulo: string;
  valor: string | number;
  icone: string;
}

export interface DadosGraficoBarras {
  labels: any[];
  datasets: any[];
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [MessageService, InicioService],
})
export class InicioComponent {
  cards: Card[] = [];
  contasPagarPeriodo: ContasPagarPeriodo[] = [];
  carregando = true;

  datasetContasPagar = {};
  options = {};

  consultaContasPagar$!: Subscription;
  consultaContasPagarPeriodo$!: Subscription;

  constructor(
    private inicioService: InicioService,
    private messageService: MessageService
  ) {
    this.getCards();

    this.options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    this.getGraphs();
  }

  getCards() {
    const results = forkJoin({
      consultaValorFaturadoMes: this.ConsultaValorFaturadoMes(),
      consultaValorFaturadoMesAnterior: this.ConsultaValorFaturadoMesAnterior(),
    });

    results.subscribe({
      next: (values: any) => {
        for (const key in values) {
          const card = values[key];

          this.cards.push(card);
        }
      },
      error: (err) => this.mensagemErro(err.error.message),
      complete: () => (this.carregando = false),
    });
  }

  ConsultaValorFaturadoMes() {
    return this.inicioService.consultaValorFaturadoMesAnterior().pipe(
      map((data) => {
        if (data.codRet === 0) {
          return {
            titulo: 'Faturamento do ultimo mês',
            valor: data.vlrFat.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            icone: 'pi pi-dollar',
          };
        } else {
          this.mensagemErro(data.msgRet);

          return {
            titulo: 'Faturamento do ultimo mês',
            valor: data.vlrFat.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            icone: 'pi pi-dollar',
          };
        }
      })
    );
  }

  ConsultaValorFaturadoMesAnterior() {
    return this.inicioService.consultaValorFaturadoMes().pipe(
      map((data) => {
        if (data.codRet === 0) {
          return {
            titulo: 'Faturamento do mês atual',
            valor: data.vlrFat.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            icone: 'pi pi-money-bill',
          };
        } else {
          this.mensagemErro(data.msgRet);

          return {
            titulo: 'Faturamento do mês atual',
            valor: data.vlrFat.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            icone: 'pi pi-money-bill',
          };
        }
      })
    );
  }

  getGraphs() {
    this.carregando = true;

    const labels: string[] = [];
    const values: string[] = [];

    this.consultaContasPagar$ = this.inicioService.ContasPagar().subscribe({
      next: (data) => {
        for (let row of data.rows) {
          labels.push(row.columns[1]);
          values.push(row.columns[2]);
        }

        this.datasetContasPagar = {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: '#0171BB',
            },
          ],
        };

        this.carregando = false;
      },
      error: (err) => console.log(err.error.message),
      complete: () => (this.carregando = false),
    });

    this.consultaContasPagarPeriodo$ = this.inicioService
      .ContasPagarPeriodo()
      .subscribe({
        next: (data) => {
          data.rows.forEach((row) => {
            this.contasPagarPeriodo.push({
              label: row.columns[0],
              value: Number(row.columns[1]),
            });
          });

          console.log(this.contasPagarPeriodo);
        },
        error: (err) => console.log(err.error.message),
        complete: () => (this.carregando = false),
      });
  }

  mensagemErro(mensagem: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
    });
  }

  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 14)];
    }

    return color;
  }

  currencyFormatter(valor: number): string {
    const valorFormatado = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return valorFormatado;
  }

  ngOnDestroy() {
    if (this.consultaContasPagar$) {
      this.consultaContasPagar$.unsubscribe();
    }
  }
}
