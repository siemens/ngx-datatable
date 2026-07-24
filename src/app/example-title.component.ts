import { Component, input } from '@angular/core';

@Component({
  selector: 'example-title',
  template: `
    <h3>
      {{ title() }}
      <small>
        <a target="_blank" rel="noopener noreferrer" [href]="sourceUrl">Source</a>
      </small>
    </h3>
  `
})
export class ExampleTitleComponent {
  readonly title = input.required<string>();
  readonly sourcePath = input.required<string>();

  get sourceUrl(): string {
    return `https://github.com/siemens/ngx-datatable/blob/main/src/app/${this.sourcePath()}`;
  }
}
