import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'column-pinning-demo',
  imports: [DatatableComponent, DataTableColumnDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        Column Pinning
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/columns/column-pinning.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        columnMode="force"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [scrollbarV]="true"
        [scrollbarH]="true"
        [rows]="rows | async"
      >
        <ngx-datatable-column name="Name" [width]="300" [frozenLeft]="true" />
        <ngx-datatable-column name="Gender" />
        <ngx-datatable-column name="Age" />
        <ngx-datatable-column name="City" prop="address.city" [width]="150" />
        <ngx-datatable-column
          name="State"
          prop="address.state"
          [width]="300"
          [frozenRight]="true"
        />
      </ngx-datatable>
    </div>
  `
})
export class ColumnPinningComponent {
  protected readonly rows = inject(DataService).load('100k.json');
}
