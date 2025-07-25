import { Component } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

@Component({
  selector: 'empty-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Custom Empty Component
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/empty.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
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
export class BasicEmptyComponent {
  columns: TableColumn[] = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company', sortable: false }
  ];
}
