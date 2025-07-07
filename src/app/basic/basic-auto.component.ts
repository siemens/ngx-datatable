import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'basic-auto-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Fluid Row Heights
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/basic-auto.component.ts"
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
        [rows]="rows"
        [loadingIndicator]="loadingIndicator"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [reorderable]="reorderable"
      />
    </div>
  `
})
export class BasicAutoComponent {
  rows: Employee[] = [];
  loadingIndicator = true;
  reorderable = true;

  columns: TableColumn[] = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company', sortable: false }
  ];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1500);
    });
  }
}
