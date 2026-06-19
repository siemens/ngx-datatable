import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent, TableColumn } from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { FullEmployee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'css-classes-demo',
  imports: [DatatableComponent, DataTableColumnDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        CSS Classes
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/css-classes.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="rows | async"
        [headerHeight]="50"
        [rowHeight]="50"
        [rowClass]="getRowClass"
        [scrollbarV]="true"
      >
        <ngx-datatable-column name="Name" />
        <ngx-datatable-column name="Gender" headerClass="is-gender" [cellClass]="getCellClass" />
        <ngx-datatable-column name="Age" />
      </ngx-datatable>
    </div>
  `
})
export class CssClassesComponent {
  protected readonly rows = inject(DataService)
    .load('100k.json')
    .pipe(map(data => data.slice(0, 50)));
  expanded = {};

  getRowClass(row: FullEmployee) {
    return {
      'age-is-ten': row.age % 10 === 0
    };
  }

  getCellClass: TableColumn['cellClass'] = ({ row, column, value }) => {
    return {
      'is-female': value === 'female'
    };
  };
}
