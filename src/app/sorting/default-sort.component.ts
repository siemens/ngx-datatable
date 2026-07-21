import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
      <h3>
        Default Sort
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/sorting/default-sort.component.ts"
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class DefaultSortComponent {
  protected readonly rows = inject(DataService).load('company.json');
}
