import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'datatable-progress',
  template: `
    <div class="progress-linear" role="progressbar" [attr.aria-label]="ariaLoadingMessage()">
      <div class="container">
        <div class="bar"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  readonly ariaLoadingMessage = input.required<string>();
}
