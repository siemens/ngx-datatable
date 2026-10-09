import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DataTableColumnHeaderLabelDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { DataService } from '../data.service';

@Component({
  selector: 'inline-template-demo',
  imports: [
    DatatableComponent,
    DataTableColumnDirective,
    DataTableColumnHeaderLabelDirective,
    DataTableColumnCellDirective,
    AsyncPipe
  ],
  template: `
    <ngx-datatable
      class="material"
      rowHeight="auto"
      columnMode="force"
      [rows]="rows | async"
      [headerHeight]="50"
      [footerHeight]="50"
    >
      <ngx-datatable-column name="Name">
        <ng-template let-column="column" ngx-datatable-header-label>
          Holla! {{ column.name }}
        </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          Hi: <strong>{{ value }}</strong>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Gender">
        <ng-template let-column="column" ngx-datatable-header-label>
          <span>{{ column.name }}</span>
        </ng-template>
        <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
          My name is: <i [innerHTML]="row['name']"></i> and <i>{{ value }}</i>
          <div>{{ joke }}</div>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Age">
        <ng-template let-value="value" ngx-datatable-cell-template>
          <div style="border:solid 1px #ddd;margin:5px;padding:3px">
            <div style="background:#999;height:10px" [style.width]="value + '%'"></div>
          </div>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `
})
export class InlineTemplateComponent {
  static readonly exampleTitle = 'Inline Template';
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 5)));
  joke = 'knock knock';
}
