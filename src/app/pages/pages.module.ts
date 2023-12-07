import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimateModule } from 'primeng/animate';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FocusTrapModule } from 'primeng/focustrap';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { ComponentsModule } from '../components/components.module';
import { BoletosComponent } from './dashboard/boletos/boletos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InicioComponent } from './dashboard/inicio/inicio.component';
import { NotasComponent } from './dashboard/notas/notas.component';
import { LoginComponent } from './login/login.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    InicioComponent,
    BoletosComponent,
    NotasComponent,
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
    SkeletonModule,
    TableModule,
    DialogModule,
    InputMaskModule,
    RadioButtonModule,
    OverlayPanelModule,
    MenuModule,
  ],
})
export class PagesModule {}
