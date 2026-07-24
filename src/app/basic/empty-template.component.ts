import { Component } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

@Component({
  selector: 'empty-template-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="[]"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
      >
        <div empty-content style="text-align: center;"
          >My custom empty component<br />uses two lines.</div
        >
      </ngx-datatable>
    </div>
  `
})
export class EmptyTemplateComponent {
  columns: TableColumn[] = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company', sortable: false }
  ];
}
