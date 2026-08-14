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
  selector: 'force-column-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective, AsyncPipe],
  template: `
    <ngx-datatable
      class="material"
      rowHeight="auto"
      columnMode="force"
      [headerHeight]="50"
      [footerHeight]="50"
      [rows]="rows | async"
    >
      <ngx-datatable-column name="Name" [width]="100" [minWidth]="160">
        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Gender" [width]="100" [minWidth]="94">
        <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Age" [width]="300" [minWidth]="75">
        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `,
  host: { class: 'datatable-example' }
})
export class ForceColumnComponent {
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 5)));
}
