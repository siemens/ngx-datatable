import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

@Component({
  selector: 'app-root',
  imports: [DatatableComponent, DataTableColumnDirective],
  template: `
    <h1>&#64;siemens/ngx-datatable Stackblitz example</h1>
    <ngx-datatable
      class="material"
      columnMode="force"
      [limit]="10"
      [rowHeight]="50"
      [headerHeight]="50"
      [footerHeight]="50"
      [rows]="mockData"
    >
      <ngx-datatable-column name="index" />
      <ngx-datatable-column name="field1" />
      <ngx-datatable-column name="field2" />
    </ngx-datatable>
  `
})
export class App {
  mockData = new Array(100).fill(0).map((_, i) => ({
    index: i,
    field1: `Field 1 - ${i}`,
    field2: `Field 2 - ${i}`
  }));
}

bootstrapApplication(App);
