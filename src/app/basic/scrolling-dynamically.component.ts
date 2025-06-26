import { Component, inject } from '@angular/core';
import {
  ColumnMode,
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent
} from 'projects/ngx-datatable/src/public-api';
import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'scrolling-dynamically-demo',
  template: `
    <div>
      <h3>
        Dynamic Vertical Scrolling
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/scrolling-dynamically.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        #mydatatable
        class="material"
        [headerHeight]="50"
        [limit]="5"
        [virtualization]="false"
        [scrollbarV]="true"
        [scrollbarVDynamic]="true"
        [columnMode]="ColumnMode.force"
        [footerHeight]="50"
        rowHeight="auto"
        [rows]="rows"
      >
        <ngx-datatable-column name="Name">
          <ng-template
            ngx-datatable-cell-template
            let-rowIndex="rowIndex"
            let-value="value"
            let-row="row"
          >
            @if (editing[rowIndex + '-name']) {
              <input (blur)="updateValue($event, 'name', rowIndex)" type="text" [value]="value" />
            } @else {
              <span title="Double click to edit" (dblclick)="editing[rowIndex + '-name'] = true">
                {{ value }}
              </span>
            }
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender">
          <ng-template
            ngx-datatable-cell-template
            let-rowIndex="rowIndex"
            let-row="row"
            let-value="value"
          >
            @if (!editing[rowIndex + '-gender']) {
              <span title="Double click to edit" (dblclick)="editing[rowIndex + '-gender'] = true">
                {{ value }}
              </span>
            }
            @if (editing[rowIndex + '-gender']) {
              <select
                (blur)="editing[rowIndex + '-gender'] = false"
                (change)="updateValue($event, 'gender', rowIndex)"
                [value]="value"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            }
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age">
          <ng-template ngx-datatable-cell-template let-value="value">
            {{ value }}
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  imports: [DatatableComponent, DataTableColumnDirective, DataTableColumnCellDirective]
})
export class ScrollingDynamicallyComponent {
  editing: Record<string, boolean> = {};
  rows: Employee[] = [];

  ColumnMode = ColumnMode;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data.slice(0, 5);
    });
  }

  updateValue(event: Event, cell: 'gender' | 'name', rowIndex: number) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }
}
