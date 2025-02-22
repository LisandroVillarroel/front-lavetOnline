import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '@shared/spinner/spinner.service';

@Component({
    selector: 'appSpinner',
    imports: [MatProgressSpinnerModule],
    template: `
    @if(this.isCargando()){
    <div class="spinerGeneral">
      <mat-progress-spinner mode="indeterminate" value="50">
      </mat-progress-spinner>
    </div>
    }
  `
})
export class SpinnerComponent implements OnInit {
  private readonly spinnerService = inject(SpinnerService);
  isCargando = this.spinnerService.isCargando;
  constructor() {}

  ngOnInit() {}
}
