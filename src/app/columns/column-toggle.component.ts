import { Component } from '@angular/core';
import {
  DataTableColumnDirective,
  DatatableComponent,
  TableColumn
} from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';

@Component({
  selector: 'column-toggle-demo',
  imports: [DatatableComponent, DataTableColumnDirective],
  template: `
    <div>
      <h3>
        Column Toggling
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/columns/column-toggle.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <div style="float:left;width:75%">
        <ngx-datatable
          class="material"
          rowHeight="auto"
          columnMode="force"
          [rows]="rows"
          [headerHeight]="50"
          [footerHeight]="50"
        >
          @for (col of columns; track col) {
            <ngx-datatable-column [name]="col.name" />
          }
        </ngx-datatable>
      </div>
      <div class="selected-column">
        <h4>Available Columns</h4>
        <ul>
          @for (col of allColumns; track col) {
            <li>
              <input
                type="checkbox"
                [id]="col.name"
                [checked]="isChecked(col)"
                (click)="toggle(col)"
              />
              <label [attr.for]="col.name">{{ col.name }}</label>
            </li>
          }
        </ul>
      </div>
    </div>
  `
})
export class ColumnToggleComponent {
  rows: Employee[] = [
    {
      name: 'Claudine Neal',
      gender: 'female',
      company: 'Sealoud'
    },
    {
      name: 'Beryl Rice',
      gender: 'female',
      company: 'Velity'
    }
  ];

  columns: TableColumn[] = [{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }];

  allColumns: TableColumn[] = [{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }];

  toggle(col: TableColumn) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => c.name !== col.name);
    } else {
      this.columns = [...this.columns, col];
    }
  }

  isChecked(col: TableColumn) {
    return this.columns.find(c => c.name === col.name) !== undefined;
  }
}
