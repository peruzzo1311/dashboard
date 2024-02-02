import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  sidebarVisivel = false;
  items: MenuItem[] = [];


  constructor() {
    this.items = [
      {
        label: 'Dashboard',
        expanded: true,
        items: [
          {
            label: 'Inicio',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['inicio'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
        ],
      },
      {
        label: 'Boletos e notas Fiscais',
        items: [
          {
            label: 'Boletos',
            icon: 'pi pi-fw pi-ticket',
            routerLink: ['boletos'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Notas fiscais',
            icon: 'pi pi-fw pi-money-bill',
            routerLink: ['notas-fiscais'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
        ],
      },
      {
        label: 'Agro',
        items: [
          {
            label: 'Romaneios',
            icon: 'pi pi-fw pi-truck',
            routerLink: ['/dashboard/romaneios'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Contratos',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: ['/dashboard/contratos'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Cotações',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/dashboard/cotacoes'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
        ],
      },

    ];
  }
}
