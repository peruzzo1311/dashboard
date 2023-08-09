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
        icon: 'pi pi-fw pi-chart-bar',

        items: [
          {
            label: 'Inicio',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/dashboard/inicio'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
        ],
      },
      {
        label: 'Faturas e notas Fiscais',
        items: [
          {
            label: 'Boletos',
            icon: 'pi pi-fw pi-ticket',
            routerLink: ['/dashboard/boletos'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Faturas',
            icon: 'pi pi-fw pi-file',
            routerLink: ['/dashboard/faturas'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Notas fiscais',
            icon: 'pi pi-fw pi-money-bill',
            routerLink: ['/dashboard/notas-fiscais'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
        ],
      },
      {
        label: 'Laudos',
        items: [
          {
            label: 'Solicitar Laudo',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/dashboard/solicitar-laudos'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Laudos Solicitados',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/dashboard/laudos-solicitados'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
          {
            label: 'Laudos Emitidos',
            icon: 'pi pi-fw pi-file',
            routerLink: ['/dashboard/laudos-emitidos'],

            command: () => {
              this.sidebarVisivel = false;
            },
          },
        ],
      },
    ];
  }
}
