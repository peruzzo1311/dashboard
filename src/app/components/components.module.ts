import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

import { HeaderComponent } from './header/header.component';
import { ModalForgotPasswordComponent } from './modal-forgot-password/modal-forgot-password.component';
import { ModalRegistroUsuarioComponent } from './modal-registro-usuario/modal-registro-usuario.component';
import { ModalResetPasswordComponent } from './modal-reset-password/modal-reset-password.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ModalRegistroUsuarioComponent,
    ModalResetPasswordComponent,
    ModalForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    SidebarModule,
    PanelMenuModule,
    DialogModule,
    RadioButtonModule,
    InputMaskModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ModalRegistroUsuarioComponent,
    ModalResetPasswordComponent,
    ModalForgotPasswordComponent,
  ],
})
export class ComponentsModule {}
