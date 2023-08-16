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
  tema: 'dark-theme' | 'light-theme' = 'light-theme';

  constructor(private router: Router, private themeService: ThemeService) {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || '');

    this.items = [
      {
        items: [
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

    this.themeService.mudarTema(this.tema);
  }
}
