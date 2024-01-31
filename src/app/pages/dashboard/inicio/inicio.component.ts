import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, forkJoin, map } from 'rxjs';
import { InicioService } from 'src/app/services/inicio.service';
import { RomaneiosService } from 'src/app/services/romaneios.service';
import { CotacoesService } from 'src/app/services/cotacoes.service';
import { Cotac } from 'src/app/types/ExportaCotacoes';

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

type Cotacao = {
  codMoe: string;
  vlrPre: number;
  desMoe: string;
  datGer: string;
  datMoe: string;
  vlrCot: number;
};

type MoedasFaltantes = {
  [codMoe: string]: boolean;
};

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [MessageService, InicioService, RomaneiosService, CotacoesService],
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
    private cotacoesService: CotacoesService,
    private messageService: MessageService
  ) {
    this.getCards();
    this.getCardsCotacoes();

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

  getCardsCotacoes() {
    const results = forkJoin({
      consultaCotacoes: this.ConsultaCotacao(),
    });

    results.subscribe({
      next: (values: any) => {
        for (const key in values) {
          const card = values[key];

          this.cardsCotacao = card;
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

  ConsultaCotacao() {
    return this.cotacoesService.ExportaCotacoes().pipe(
      map((data) => {
        const codigosMoedaDesejados = [
          { codMoe: "05", tituloPadrao: "Soja" },
          { codMoe: "06", tituloPadrao: "Milho" },
          { codMoe: "07", tituloPadrao: "Trigo" },
          // Adicione mais moedas conforme necessário
        ];

        const mapeamentoIcones: {
          [codMoe: string]: string;
        } = {
          "?": "https://cdn.icon-icons.com/icons2/2106/PNG/512/na_icon_129660.png",
          "05": "../../../../assets/images/soja.png",
          "06": "../../../../assets/images/milho.png",
          "07": "../../../../assets/images/trigo.png",
          // Adicione mais mapeamentos conforme necessário
        };

        const obterIconePorCodMoe = (codMoe: string): string => {
          return mapeamentoIcones[codMoe] || "caminho_do_icone_padrao.png"; // Fallback para um ícone padrão, se necessário
        };

        if (data.codRet === 0) {
          const cotacoes = data.cotacoes;

          const dataAtual: string = this.obterDataAtualFormatada();

          const codigosMoeda = codigosMoedaDesejados.map(item => item.codMoe);

          const resultado: Cotacao[] = this.filtrarCotacoes(cotacoes, codigosMoeda, dataAtual);

          const moedasFaltantes = this.verificarMoedasFaltantes(resultado, codigosMoedaDesejados);

          const resultadoFinal = resultado.map((cotacao: Cotac) => {
            return {
                titulo: `${cotacao.desMoe}`,
                valor: `R$${cotacao.vlrCot}`,
                icone: obterIconePorCodMoe(cotacao.codMoe),
            }
          })

          codigosMoedaDesejados.forEach(({ codMoe, tituloPadrao }) => {
            if (moedasFaltantes[codMoe]) {
              const moeda: any = {
                titulo: `${tituloPadrao} Sem Cotação no momento`,
                valor: ``,
                icone: obterIconePorCodMoe(codMoe),
              };

              resultadoFinal.push(moeda);
            }
          });

          return resultadoFinal;
        } else {
          const semCotacao = codigosMoedaDesejados.map((moeda) => {
            return {
                titulo: `${moeda.tituloPadrao} Sem Cotação no momento`,
                valor: ``,
                icone: obterIconePorCodMoe(moeda.codMoe),
              }
          })


          return semCotacao;
        }
      })
    )
  }

  filtrarCotacoes = (cotacoes: Cotacao[] , codigosMoeda: string[], data: string): Cotacao[]  => {
    const cotacoesFiltradas: { [key: string]: Cotacao } = {};

    cotacoes.forEach(cotacao => {
      if (
        codigosMoeda.includes(cotacao.codMoe) &&
        cotacao.datMoe === data
      ) {
        cotacoesFiltradas[cotacao.codMoe] = cotacao;
      }
    });

    return Object.values(cotacoesFiltradas);
  };

  verificarMoedasFaltantes = (
    cotacoes: Cotacao[],
    codigosMoedaDesejados: { codMoe: string, tituloPadrao: string }[]
  ): MoedasFaltantes => {
    const moedasPresentes = new Set(cotacoes.map(cotacao => cotacao.codMoe));
    const moedasFaltantes: MoedasFaltantes = {};

    codigosMoedaDesejados.forEach(({ codMoe }) => {
      moedasFaltantes[codMoe] = !moedasPresentes.has(codMoe);
    });

    return moedasFaltantes;
  };

  obterDataAtualFormatada(): string {
    const data: Date = new Date();
    const dia: string = String(data.getDate()).padStart(2, '0');
    const mes: string = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano: number = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
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
