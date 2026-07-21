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
  selector: 'flex-column-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        Flex Column
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/columns/flex-column.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="flex"
        [headerHeight]="50"
        [footerHeight]="50"
        [rows]="rows | async"
      >
        <ngx-datatable-column name="Name" [flexGrow]="3">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender" [flexGrow]="1">
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age" [flexGrow]="1">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class FlexColumnComponent {
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 5)));
}
