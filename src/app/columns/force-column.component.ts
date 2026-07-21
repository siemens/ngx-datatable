import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { DataService } from '../data.service';

@Component({
  selector: 'force-column-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        Force Column
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/columns/force-column.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [headerHeight]="50"
        [footerHeight]="50"
        [rows]="rows | async"
      >
        <ngx-datatable-column name="Name" [width]="100">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender" [width]="100">
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age" [width]="300">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ForceColumnComponent {
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 5)));
}
