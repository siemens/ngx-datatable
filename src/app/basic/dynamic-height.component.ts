import { Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

import { FullEmployee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'dynamic-height-demo',
  imports: [DatatableComponent, DataTableColumnDirective],
  template: `
    <div>
      <h3>
        Dynamic Height w/ Virtual Scrolling
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/dynamic-height.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="rows"
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
export class DynamicHeightComponent {
  rows: (FullEmployee & { height: number })[] = [];
  expanded = {};
  timeout: any;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('100k.json').subscribe(data => {
      this.rows = data
        .splice(0, 100)
        .map(d => ({ ...d, height: Math.floor(Math.random() * 80) + 50 }));
    });
  }

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
