import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, forkJoin, map } from 'rxjs';
import { InicioService } from 'src/app/services/inicio.service';
import { RomaneiosService } from 'src/app/services/romaneios.service';

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

interface Romaneio {
  label: string | number;
  qntAbe: number;
  safra: string;
  cplIpo: string;
  desPro: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [MessageService, InicioService, RomaneiosService],
})
export class InicioComponent {
  cards: Card[] = [];
  cardsCotacao: any = [];
  contasPagarPeriodo: ContasPagarPeriodo[] = [];
  carregandoCards = true;
  carregandoGraficos = true;

  datasetContasPagar = {};
  datasetRomenios = {};
  options = {};
  optionsRomaneios = {};
  safras: any = [];
  selectedSafra = '';
  NewSeletedSafra = { name: '' };

  consultaContasPagar$!: Subscription;
  consultaContasPagarPeriodo$!: Subscription;
  consultaRomaneios$!: Subscription;
  exportapagamentos$!: Subscription;
  exportapagamentosperiodo$!: Subscription;

  constructor(
    private inicioService: InicioService,
    private romaneiosService: RomaneiosService,
    private messageService: MessageService
  ) {
    this.getCards();
    this.cardsCotacao = this.ConsultaCotacao();

    this.options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    this.optionsRomaneios = {
      indexAxis: 'y',
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

          console.log("CARDS > ",this.cards)
        }
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );

          console.log(err);
        }
      },
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

  ConsultaCotacao() {
    return [
      {
        titulo: 'Valor Soja - Hoje',
        valor: "R$ 50,00",
        icone: `../../../../assets/images/soja.png`,
      },
      {
        titulo: 'Valor Trigo - Hoje',
        valor: "R$ 50,00",
        icone: `../../../../assets/images/trigo.png`,
      },
      {
        titulo: 'Valor Milho - Hoje',
        valor: "R$ 50,00",
        icone: `../../../../assets/images/milho.png`,
      },
      ];
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
      consultaRomaneios: this.ConsultaRomaneios(),
    });

    results.subscribe({
      next: (values: any) => {
        this.datasetContasPagar = values.consultaContasPagar;
        this.contasPagarPeriodo = values.consultaContasPagarPeriodo;
        this.datasetRomenios = values.consultaRomaneios;

        //console.log("DataSetRomaneios",this.datasetRomenios)
      },
      error: (err) => {
        if (err.status === 500) {
          this.mensagemErro(
            'Servidor indisponível, tente novamente mais tarde.'
          );
        }
      },
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

  ConsultaRomaneios() {
    return this.romaneiosService.ExportaRomaneios().pipe(
      map((data) => {
        if (data.codRet === 0) {
          const newRomaneios: Romaneio[] = [];
          const backgroundColor = data.romaneios.map(() =>
            this.generateRandomColor()
          );

          data.romaneios.forEach((romaneio, index) => {
            newRomaneios.push({
              label: romaneio.codPro,
              qntAbe: romaneio.qtdAbe,
              safra: romaneio.codSaf.toString(),
              cplIpo: romaneio.cplIpo,
              desPro: romaneio.desPro,
              backgroundColor: backgroundColor[index],
            });
          });

          const resultado = newRomaneios.reduce<Romaneio[]>((acc, obj) => {
            const foundIndex = acc.findIndex(
              (item) => item.label === obj.label
            );

            if (foundIndex !== -1) {
              acc[foundIndex].qntAbe += obj.qntAbe;
            } else {
              acc.push({ ...obj });
            }

            return acc;
          }, []);

          const safrasUnicas = [
            ...new Set(data.romaneios.map((obj) => obj.codSaf)),
          ];

          this.safras = safrasUnicas.map((safr) => ({ name: safr }));

          if (!this.selectedSafra) {
            this.selectedSafra = this.safras[0].name;
          } else {
            this.selectedSafra = this.NewSeletedSafra.name;
          }

          const labels = resultado
            .filter(
              (titulo) =>
                titulo.safra.toString() === this.selectedSafra.toString()
            )
            .map((titulo) => titulo.desPro);

          const datasets = [
            {
              data: resultado.map((item) => item.qntAbe),
              backgroundColor: resultado.map((item) => item.backgroundColor),
            },
          ];

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

    if (this.consultaContasPagarPeriodo$) {
      this.consultaContasPagarPeriodo$.unsubscribe();
    }

    if (this.exportapagamentos$) {
      this.exportapagamentos$.unsubscribe();
    }

    if (this.exportapagamentosperiodo$) {
      this.exportapagamentosperiodo$.unsubscribe();
    }
  }
}
