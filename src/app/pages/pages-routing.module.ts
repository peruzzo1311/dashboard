import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InicioComponent } from './dashboard/inicio/inicio.component';
import { BoletosComponent } from './dashboard/boletos/boletos.component';
import { FaturasComponent } from './dashboard/faturas/faturas.component';
import { NotasComponent } from './dashboard/notas/notas.component';
import { SolicitarLaudosComponent } from './dashboard/solicitar-laudos/solicitar-laudos.component';
import { LaudosSolicitadosComponent } from './dashboard/laudos-solicitados/laudos-solicitados.component';
import { LaudosEmitidosComponent } from './dashboard/laudos-emitidos/laudos-emitidos.component';

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
      {
        path: 'solicitar-laudos',
        component: SolicitarLaudosComponent,
      },
      {
        path: 'laudos-solicitados',
        component: LaudosSolicitadosComponent,
      },
      {
        path: 'laudos-emitidos',
        component: LaudosEmitidosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
