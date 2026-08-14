import { Component } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

@Component({
  selector: 'empty-template-demo',
  imports: [DatatableComponent],
  template: `
    <ngx-datatable
      class="material"
      columnMode="force"
      scrollbarV
      [rows]="[]"
      [columns]="columns"
      [headerHeight]="50"
      [footerHeight]="50"
    >
      <div empty-content>My custom empty component<br />uses two lines.</div>
    </ngx-datatable>
  `,
  styles: `
    ngx-datatable {
      min-block-size: 50vh;
    }

    [empty-content] {
      block-size: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  `
})
export class EmptyTemplateComponent {
  columns: TableColumn[] = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company', sortable: false }
  ];
}
