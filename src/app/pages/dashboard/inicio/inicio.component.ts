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
  data: number;
  safra: string;
  cplIpo: string;
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
  contasPagarPeriodo: ContasPagarPeriodo[] = [];
  carregandoCards = true;
  carregandoGraficos = true;

  datasetContasPagar = {};
  datasetRomenios = {};
  options = {};
  optionsRomaneios = {};
  safras: any = []
  selectedSafra = "";
  NewSeletedSafra = {name: ""};

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
    }

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
      consultaRomaneios: this.ConsultaRomaneios()
    });

    results.subscribe({
      next: (values: any) => {
        this.datasetContasPagar = values.consultaContasPagar;
        this.contasPagarPeriodo = values.consultaContasPagarPeriodo;
        this.datasetRomenios = values.consultaRomaneios;

        console.log("DataSetRomaneios",this.datasetRomenios)
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

          //console.log(datasets);

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
          )

          data.romaneios.forEach((romaneio, index) => {
            newRomaneios.push({
              label: romaneio.codPro,
              data: romaneio.qtdAbe,
              safra: romaneio.codSaf.toString(),
              cplIpo: romaneio.cplIpo,
              backgroundColor: backgroundColor[index]
            });
          });

          const resultado = newRomaneios.reduce<Romaneio[]>((acc, obj) => {
            const foundIndex = acc.findIndex(item => item.label === obj.label);

            if (foundIndex !== -1) {
              acc[foundIndex].data += obj.data;
            } else {
              acc.push({...obj});
            }

            return acc;
          }, []);
          console.log("Resultado: ",resultado)



          //data.romaneios.forEach((romaneio) => console.log(romaneio))
          //console.log("Retorno api",data.romaneios)

          const safrasUnicas = [...new Set(data.romaneios.map(obj => obj.codSaf))];
          //console.log("Safras", safrasUnicas.map(safr => ({ name:safr })))

          this.safras = safrasUnicas.map(safr => ({ name:safr }));

          if (!this.selectedSafra) {
            this.selectedSafra = this.safras[0].name
            console.log("Safra selecionada 1:" ,this.selectedSafra)
          } else {
            this.selectedSafra = this.NewSeletedSafra.name
            console.log("Safra selecionada 2:" ,this.selectedSafra)
          }

          const labels = resultado.filter((titulo) => titulo.safra.toString() === this.selectedSafra.toString()).map((titulo) => titulo.cplIpo);

          const datasets = [{
            data: resultado.map(item => item.data),
            backgroundColor: resultado.map((item) => item.backgroundColor)
          }];

          //console.log(datasets);

          return { labels ,datasets };
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

  Teste() {
    this.getGraphs()
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
