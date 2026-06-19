import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'fixed-row-height-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <h3>
        Fixed Row Height
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/fixed-row-height.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material striped"
        columnMode="force"
        [rows]="rows | async"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
      />
    </div>
  `
})
export class FixedRowHeightComponent {
  protected readonly rows = inject(DataService).load('company.json');
  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];
}
