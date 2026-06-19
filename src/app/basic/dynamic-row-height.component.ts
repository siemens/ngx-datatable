import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { FullEmployee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'dynamic-row-height-demo',
  imports: [DatatableComponent, DataTableColumnDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        Dynamic Row Height
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/dynamic-row-height.component.ts"
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
        [rowHeight]="getRowHeight"
        [scrollbarV]="true"
      >
        <ngx-datatable-column name="Name" />
        <ngx-datatable-column name="Gender" />
        <ngx-datatable-column name="Row Height" prop="height" />
      </ngx-datatable>
    </div>
  `
})
export class DynamicRowHeightComponent {
  protected readonly rows = inject(DataService)
    .load('100k.json')
    .pipe(
      map(data =>
        data.slice(0, 100).map(d => ({ ...d, height: Math.floor(Math.random() * 80) + 50 }))
      )
    );
  expanded = {};
  timeout: any;

  getRowHeight(row: FullEmployee & { height: number }) {
    if (!row) {
      return 50;
    }
    if (row.height === undefined) {
      return 50;
    }
    return row.height;
  }
}
