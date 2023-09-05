import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, forkJoin, map } from 'rxjs';
import { InicioService } from 'src/app/services/inicio.service';

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
  carregando = true;

  consultaContasPagar$!: Subscription;

  constructor(
    private inicioService: InicioService,
    private messageService: MessageService
  ) {
    this.getCards();

    this.getGraphs();
  }

  getCards() {
    const consultaValorFaturadoMes = this.inicioService
      .consultaValorFaturadoMes()
      .pipe(
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

    const consultaValorFaturadoMesAnterior = this.inicioService
      .consultaValorFaturadoMesAnterior()
      .pipe(
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

    forkJoin([
      consultaValorFaturadoMes,
      consultaValorFaturadoMesAnterior,
    ]).subscribe((results) => {
      results.forEach((result) => {
        if (result) {
          this.cards.push(result);
        }
      });

      this.carregando = false;
    });
  }

  getGraphs() {
    this.consultaContasPagar$ = this.inicioService
      .ContasPagar()
      .subscribe((data) => console.log(data));
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

  ngOnDestroy() {
    if (this.consultaContasPagar$) {
      this.consultaContasPagar$.unsubscribe();
    }
  }
}
