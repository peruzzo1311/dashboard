import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  providers: [TranslateService, PrimeNGConfig],
})
export class AppComponent {
  constructor(
    private primengConfig: PrimeNGConfig,
    private translateService: TranslateService
  ) {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('pt-BR');
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe((res) => this.primengConfig.setTranslation(res));
  }
}
