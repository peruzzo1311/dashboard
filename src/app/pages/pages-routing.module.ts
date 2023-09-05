import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoletosComponent } from './dashboard/boletos/boletos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InicioComponent } from './dashboard/inicio/inicio.component';
import { NotasComponent } from './dashboard/notas/notas.component';
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
