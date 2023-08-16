import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/services/theme.service';
import Usuario from 'src/app/types/Usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  items: MenuItem[];
  usuario: Usuario;
  tema: 'dark-theme' | 'light-theme';

  constructor(public router: Router, private themeService: ThemeService) {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || '');
    this.tema = localStorage.getItem('tema') as 'dark-theme' | 'light-theme';

    this.items = [
      {
        items: [
          {
            label: this.tema === 'light-theme' ? 'Tema escuro' : 'Tema claro',
            icon: this.tema === 'light-theme' ? 'pi pi-moon' : 'pi pi-sun',
            command: () => {
              this.mudarTema();
            },
          },
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => {
              sessionStorage.removeItem('usuario');
              this.router.navigate(['']);
            },
          },
        ],
      },
    ];
  }

  mudarTema() {
    this.tema = this.tema === 'light-theme' ? 'dark-theme' : 'light-theme';

    localStorage.setItem('tema', this.tema);

    this.items = [
      {
        items: [
          {
            label: this.tema === 'light-theme' ? 'Tema escuro' : 'Tema claro',
            icon: this.tema === 'light-theme' ? 'pi pi-moon' : 'pi pi-sun',
            command: () => {
              this.mudarTema();
            },
          },
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => {
              sessionStorage.removeItem('usuario');
              this.router.navigate(['']);
            },
          },
        ],
      },
    ];

    this.themeService.mudarTema(this.tema);
  }
}
