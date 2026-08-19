import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { DataService } from '../data.service';

@Component({
  selector: 'flex-column-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective, AsyncPipe],
  template: `
    <ngx-datatable
      class="material"
      rowHeight="auto"
      columnMode="flex"
      [headerHeight]="50"
      [footerHeight]="50"
      [rows]="rows | async"
    >
      <ngx-datatable-column name="Name" [flexGrow]="3" [minWidth]="160">
        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Gender" [flexGrow]="1" [minWidth]="94">
        <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Age" [flexGrow]="1" [minWidth]="75">
        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `,
  host: { class: 'datatable-example' }
})
export class FlexColumnComponent {
  static readonly exampleTitle = 'Flex Column';
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 5)));
}
