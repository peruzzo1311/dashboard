import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { InicioService } from 'src/app/services/inicio.service';
import { Meses } from 'src/app/types/exportaVolumeMeses';

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
  providers: [MessageService],
})
export class InicioComponent {
  cards: Card[] = [];
  carregando = true;
  datasetGraficoBarras: any;
  datasetDoughnut: any;
  optionsBar: any = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    borderWidth: 0,
  };
  optionsDoughnut: any = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    borderWidth: 0,
  };

  constructor(
    private inicioService: InicioService,
    private messageService: MessageService
  ) {
    this.getCards();

    this.getDadosGraficoDoughnut();
  }

  getCards() {
    this.inicioService.exportaVolumesMeses().subscribe((data) => {
      let volumeMensalConsumido = 0;

      if (data.codRet === 0) {
        this.getDadosGraficoBarras(data.meses);

        data.meses.forEach((mes) => {
          if (mes.obras) {
            if (Array.isArray(mes.obras)) {
              mes.obras.forEach((obra) => {
                volumeMensalConsumido += obra.volMt3;
              });
            } else {
              volumeMensalConsumido += mes.obras.volMt3;
            }
          }
        });
      } else {
        this.mensagemErro(data.msgRet);
      }

      this.cards.push({
        titulo: 'Volume dos últimos 6 meses',
        valor: `${volumeMensalConsumido} m³`,
        icone: 'pi pi-users',
      });
    });

    this.inicioService.consultaValorFaturadoMes().subscribe((data) => {
      if (data.codRet === 0) {
        this.cards.push({
          titulo: 'Faturamento do mês atual',
          valor: data.vlrFat.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          icone: 'pi pi-money-bill',
        });
      } else {
        this.mensagemErro(data.msgRet);
      }
    });

    this.inicioService.consultaVolumeMes().subscribe((data) => {
      if (data.codRet === 0) {
        this.cards.push({
          titulo: 'Concretagem do mês atual',
          valor: `${data.volMt3} m³`,
          icone: 'pi pi-truck',
        });
      } else {
        this.mensagemErro(data.msgRet);
      }
    });

    this.carregando = false;
  }

  getDadosGraficoBarras(data: Meses[]) {
    const nomesMeses: string[] = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const labels = data.map((mes) => nomesMeses[mes.mes - 1]);

    const obrasMap = new Map<number, { codObr: number; desObr: string }>();
    const volumeMensal = new Map<number, number[]>();
    const datasets = [];

    data.forEach((mes) => {
      if (mes.obras) {
        if (Array.isArray(mes.obras)) {
          mes.obras.forEach((obra) => {
            obrasMap.set(obra.codObr, obra);
          });
        } else {
          obrasMap.set(mes.obras.codObr, mes.obras);
        }
      }
    });

    for (const codObr of Array.from(obrasMap.keys())) {
      const volumes = [];

      for (const mes of data) {
        const obra = obrasMap.get(codObr);
        const obras = Array.isArray(mes.obras) ? mes.obras : [mes.obras];
        const obraMes = obras.find((obr) => obr.codObr === codObr) || {
          volMt3: 0,
        };
        volumes.push(obraMes.volMt3);
      }

      volumeMensal.set(codObr, volumes);
    }

    for (const [codObr, volumes] of volumeMensal) {
      const obra = obrasMap.get(codObr);

      const dataset = {
        label: obra ? obra.desObr : `Obra ${codObr}`,
        backgroundColor: this.generateRandomColor(),
        data: volumes,
      };

      datasets.push(dataset);
    }

    this.datasetGraficoBarras = {
      labels,
      datasets,
    };
  }

  getDadosGraficoDoughnut() {
    this.inicioService.exportaVolumeObrasMes().subscribe((data) => {
      if (data.codRet === 0) {
        if (Array.isArray(data.obras)) {
          this.datasetDoughnut = {
            labels: data.obras.map((obra) => obra.desObr),
            datasets: [
              {
                data: data.obras.map((obra) => obra.volMt3),
                backgroundColor: data.obras.map(() =>
                  this.generateRandomColor()
                ),
              },
            ],
          };
        } else {
          this.datasetDoughnut = {
            labels: [data.obras.desObr],
            datasets: [
              {
                data: [data.obras.volMt3],
                backgroundColor: [this.generateRandomColor()],
              },
            ],
          };
        }
      } else {
        this.mensagemErro(data.msgRet);
      }
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
}
