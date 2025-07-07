import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'column-reorder-demo',
  imports: [DatatableComponent, NgClass],
  template: `
    <div>
      <h3>
        Reorder Column
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/columns/column-reorder.component.ts"
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
        [swapColumns]="swapColumns"
        [targetMarkerTemplate]="targetMarkerTemplate"
      />
      <ng-template #targetMarkerTemplate let-class="class">
        <div [ngClass]="class">
          <div class="icon datatable-icon-down"></div>
          <div class="icon datatable-icon-up"></div>
        </div>
      </ng-template>
    </div>
  `,
  styles: `
    .icon {
      position: absolute;
    }
    .datatable-icon-down {
      top: 0px;
    }
    .datatable-icon-up {
      top: 40px;
    }
    .dragFromLeft .icon {
      left: -13px;
    }
  `
})
export class ColumnReorderComponent {
  rows: Employee[] = [];
  loadingIndicator = true;
  reorderable = true;
  swapColumns = false;

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
