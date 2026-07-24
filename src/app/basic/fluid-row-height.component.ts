import { Component, inject, signal } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'fluid-row-height-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [rowDraggable]="true"
        [rows]="rows()"
        [loadingIndicator]="loadingIndicator()"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [reorderable]="reorderable"
      />
    </div>
  `
})
export class FluidRowHeightComponent {
  private dataService = inject(DataService);
  readonly rows = signal<Employee[]>([]);
  readonly loadingIndicator = signal(true);
  reorderable = true;

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
