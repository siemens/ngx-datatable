import { Component, inject, signal } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'column-reorder-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      @let rows = this.rows();
      @let loadingIndicator = this.loadingIndicator();
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
        <div [class]="class">
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
  private dataService = inject(DataService);
  readonly rows = signal<Employee[]>([]);
  readonly loadingIndicator = signal(true);
  reorderable = true;
  swapColumns = false;

  columns: TableColumn[] = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company', sortable: false }
  ];

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows.set(data);
      setTimeout(() => this.loadingIndicator.set(false), 1500);
    });
  }
}
