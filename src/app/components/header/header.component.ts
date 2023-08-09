import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import Usuario from 'src/app/types/Usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  items: MenuItem[];
  usuario: Usuario;

  constructor(private router: Router) {
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
}
