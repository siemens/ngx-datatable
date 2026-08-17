# Configuration

Use `providedNgxDatatableConfig` to set defaults shared by all `ngx-datatable` instances in an application.
Register it during bootstrap:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { providedNgxDatatableConfig } from '@siemens/ngx-datatable';

bootstrapApplication(AppComponent, {
  providers: [
    providedNgxDatatableConfig({
      rowHeight: 48,
      headerHeight: 48,
      defaultColumnWidth: 200,
      messages: {
        emptyMessage: 'No results found',
        totalMessage: 'results'
      }
    })
  ]
});
```

See the [NgxDatatableConfig API reference](../api/reference/ngx-datatable-config.md) for available configuration options.

## Per-table Overrides

Most properties can be overridden per table instance.
`messages` and `cssClasses` support partial overrides.
They are merged with the global configuration and the built-in defaults.

```html
<ngx-datatable [rows]="rows" [rowHeight]="64" [messages]="{ emptyMessage: 'No orders found' }">
  ...
</ngx-datatable>
```
