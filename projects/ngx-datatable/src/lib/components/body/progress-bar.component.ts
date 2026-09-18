import { Component, inject } from '@angular/core';

import { DatatableConfiguration } from '../datatable-configuration';

@Component({
  selector: 'datatable-progress',
  template: `
    <div
      class="progress-linear"
      role="progressbar"
      [attr.aria-label]="configuration().messages.ariaLoadingMessage"
    >
      <div class="container">
        <div class="bar"></div>
      </div>
    </div>
  `
})
export class ProgressBarComponent {
  protected readonly configuration = inject(DatatableConfiguration).configuration;
}
