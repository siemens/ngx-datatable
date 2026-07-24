import { Component, inject } from '@angular/core';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'vert-dynamic-scrolling-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective],
  template: `
    <div>
      <ngx-datatable
        #mydatatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [headerHeight]="50"
        [limit]="5"
        [virtualization]="false"
        [scrollbarV]="true"
        [scrollbarVDynamic]="true"
        [footerHeight]="50"
        [rows]="rows"
      >
        <ngx-datatable-column name="Name">
          <ng-template
            let-rowIndex="rowIndex"
            let-value="value"
            let-row="row"
            ngx-datatable-cell-template
          >
            @if (editing[rowIndex + '-name']) {
              <input type="text" [value]="value" (blur)="updateValue($event, 'name', rowIndex)" />
            } @else {
              <span title="Double click to edit" (dblclick)="editing[rowIndex + '-name'] = true">
                {{ value }}
              </span>
            }
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender">
          <ng-template
            let-rowIndex="rowIndex"
            let-row="row"
            let-value="value"
            ngx-datatable-cell-template
          >
            @if (!editing[rowIndex + '-gender']) {
              <span title="Double click to edit" (dblclick)="editing[rowIndex + '-gender'] = true">
                {{ value }}
              </span>
            } @else {
              <select
                [value]="value"
                (blur)="editing[rowIndex + '-gender'] = false"
                (change)="updateValue($event, 'gender', rowIndex)"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            }
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>
    </div>
  `
})
export class VertDynamicScrollingComponent {
  private dataService = inject(DataService);
  editing: Record<string, boolean> = {};
  rows: Employee[] = [];

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data.slice(0, 5);
    });
  }

  updateValue(event: Event, cell: 'gender' | 'name', rowIndex: number) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.rows = [...this.rows];
  }
}
