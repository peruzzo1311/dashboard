import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoletosComponent } from './dashboard/boletos/boletos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaturasComponent } from './dashboard/faturas/faturas.component';
import { InicioComponent } from './dashboard/inicio/inicio.component';
import { NotasComponent } from './dashboard/notas/notas.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'boletos',
        component: BoletosComponent,
      },
      {
        path: 'faturas',
        component: FaturasComponent,
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
