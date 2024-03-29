import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoletosComponent } from './dashboard/boletos/boletos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InicioComponent } from './dashboard/inicio/inicio.component';
import { NotasComponent } from './dashboard/notas/notas.component';
import { RomaneiosComponent } from './dashboard/romaneios/romaneios.component';
import { ContratosComponent } from './dashboard/contratos/contratos.component';
import { CotacoesComponent } from './dashboard/cotacoes/cotacoes.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivateChild: [
      () => {
        if (sessionStorage.getItem('usuario')) {
          return true;
        } else {
          return false;
        }
      },
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio',
      },
      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'boletos',
        component: BoletosComponent,
      },
      {
        path: 'notas-fiscais',
        component: NotasComponent,
      },
      {
        path: 'romaneios',
        component: RomaneiosComponent,
      },
      {
        path: 'contratos',
        component: ContratosComponent,
      },
      {
        path: 'cotacoes',
        component: CotacoesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
