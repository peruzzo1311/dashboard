import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  providers: [TranslateService, PrimeNGConfig],
})
export class AppComponent {
  constructor(
    private primengConfig: PrimeNGConfig,
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('pt-BR');

    const tema = localStorage.getItem('tema');

    if (tema) {
      this.themeService.mudarTema(tema);
    }
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe((res) => this.primengConfig.setTranslation(res));
  }
}
