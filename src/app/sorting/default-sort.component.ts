import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'default-sort-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective, AsyncPipe],
  template: `
    <div>
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="rows | async"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [scrollbarV]="true"
        [enableClearingSortState]="true"
        [sorts]="[{ prop: 'name', dir: 'desc' }]"
      >
        <ngx-datatable-column name="Company">
          <ng-template let-row="row" ngx-datatable-cell-template>
            {{ row.company }}
          </ng-template>
        </ngx-datatable-column>

        <ngx-datatable-column name="Name">
          <ng-template let-row="row" ngx-datatable-cell-template>
            {{ row.name }}
          </ng-template>
        </ngx-datatable-column>

        <ngx-datatable-column name="Gender" />
      </ngx-datatable>
    </div>
  `
})
export class DefaultSortComponent {
  protected readonly rows = inject(DataService).load('company.json');
}
