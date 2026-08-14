# Getting Started

You can grab the latest release from the [Releases Page](https://github.com/siemens/ngx-datatable/releases)
in GitHub or via [NPM](https://www.npmjs.com/package/@siemens/ngx-datatable).

- `npm install @siemens/ngx-datatable`

## CSS

To use the material theme, add the following to your application's SCSS file and apply the `material` class to your data table:

```scss
@use '@siemens/ngx-datatable/themes/material';
@import '@siemens/ngx-datatable/assets/icons.css';
```

For more information, visit the [Theming](themes.md) section.

## Add a table

In your `app.component.ts`, import `DatatableComponent` directly into your standalone component and apply the `material` class to the data table:

```typescript
import { Component } from '@angular/core';
import { DatatableComponent } from '@siemens/ngx-datatable';

@Component({
  selector: 'app',
  imports: [DatatableComponent],
  template: `
    <div>
      <ngx-datatable class="material" [rows]="rows" [columns]="columns"> </ngx-datatable>
    </div>
  `
})
export class AppComponent {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' }
  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
}
```

and you're off to the races!

For more examples, visit the
[demos](https://github.com/siemens/ngx-datatable/tree/main/src/app) directory
in the source code!
