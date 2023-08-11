import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimateModule } from 'primeng/animate';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FocusTrapModule } from 'primeng/focustrap';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';

import { ComponentsModule } from '../components/components.module';
import { BoletosComponent } from './dashboard/boletos/boletos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaturasComponent } from './dashboard/faturas/faturas.component';
import { InicioComponent } from './dashboard/inicio/inicio.component';
import { LaudosEmitidosComponent } from './dashboard/laudos-emitidos/laudos-emitidos.component';
import { LaudosSolicitadosComponent } from './dashboard/laudos-solicitados/laudos-solicitados.component';
import { NotasComponent } from './dashboard/notas/notas.component';
import { SolicitarLaudosComponent } from './dashboard/solicitar-laudos/solicitar-laudos.component';
import { LoginComponent } from './login/login.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    InicioComponent,
    BoletosComponent,
    FaturasComponent,
    NotasComponent,
    SolicitarLaudosComponent,
    LaudosSolicitadosComponent,
    LaudosEmitidosComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    AutoFocusModule,
    ButtonModule,
    CheckboxModule,
    FocusTrapModule,
    InputTextModule,
    RippleModule,
    CardModule,
    ToastModule,
    ChartModule,
  ],
})
export class PagesModule {}
