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
  carregandoCards = true;
  carregandoGraficos = true;

  datasetContasPagar = {};
  options = {};

  consultaContasPagar$!: Subscription;
  consultaContasPagarPeriodo$!: Subscription;
  exportapagamentos$!: Subscription;
  exportapagamentosperiodo$!: Subscription;

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
      complete: () => (this.carregandoCards = false),
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
    const results = forkJoin({
      consultaContasPagar: this.ConsultaContasPagar(),
      consultaContasPagarPeriodo: this.ConsultaContasPagarPeriodo(),
    });

    results.subscribe({
      next: (values: any) => {
        this.datasetContasPagar = values.consultaContasPagar;
        this.contasPagarPeriodo = values.consultaContasPagarPeriodo;
      },
      error: (err) => this.mensagemErro(err.error.message),
      complete: () => (this.carregandoGraficos = false),
    });
  }

  ConsultaContasPagar() {
    return this.inicioService.ExportaPagamentos().pipe(
      map((data) => {
        if (data.codRet === 0) {
          const labels = data.titulo.map((titulo) => {
            return titulo.vctPro;
          });
          const datasets = [
            {
              data: data.titulo.map((titulo) => titulo.vlrAbe ?? 0),
              backgroundColor: data.titulo.map((titulo) =>
                this.generateRandomColor()
              ),
            },
          ];

          console.log(datasets);

          return { labels, datasets };
        } else {
          this.mensagemErro(data.msgRet);

          return {
            labels: [],
            datasets: [],
          };
        }
      })
    );
  }

  ConsultaContasPagarPeriodo() {
    return this.inicioService.ExportaPagamentosPeriodo().pipe(
      map((data) => {
        if (data.codRet === 0) {
          return data.periodo.map((periodo) => {
            return {
              label: periodo.descricao,
              value: periodo.vlrAbe,
            };
          });
        } else {
          this.mensagemErro(data.msgRet);

          return [];
        }
      })
    );
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
