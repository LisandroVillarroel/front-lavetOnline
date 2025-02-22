import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChequeaPlataformaService {
  plataformaId = inject(PLATFORM_ID)

  chequeaSiServer(): boolean {
    return isPlatformServer(this.plataformaId)
  }

  chequeaSiBrowser(): boolean {
    return isPlatformBrowser(this.plataformaId)
  }
}
