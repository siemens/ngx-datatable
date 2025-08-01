import { Component, inject } from '@angular/core';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent,
  DisableRowDirective
} from '@siemens/ngx-datatable';

import { FullEmployee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'disabled-rows-demo',
  imports: [
    DatatableComponent,
    DataTableColumnDirective,
    DataTableColumnCellDirective,
    DisableRowDirective
  ],
  template: `
    <div>
      <h3>
        Disable Row
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/disabled-rows.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <div>
        <ngx-datatable
          class="material"
          columnMode="force"
          [rows]="rows"
          [headerHeight]="50"
          [footerHeight]="0"
          [rowHeight]="80"
          [scrollbarV]="true"
          [disableRowCheck]="isRowDisabled"
        >
          <ngx-datatable-column name="Name">
            <ng-template
              let-value="value"
              let-rowIndex="rowIndex"
              let-row="row"
              let-disabled="disabled"
              ngx-datatable-cell-template
            >
              {{ value }}
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Gender">
            <ng-template
              let-value="value"
              let-rowIndex="rowIndex"
              let-row="row"
              let-disabled="disabled"
              ngx-datatable-cell-template
            >
              <select
                [style.height]="'auto'"
                [value]="value"
                [disabled]="disabled"
                [style.margin]="0"
                (change)="updateValue($event, 'gender', rowIndex)"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Age">
            <ng-template
              let-row="row"
              let-disabled="disabled"
              let-rowIndex="rowIndex"
              let-value="value"
              ngx-datatable-cell-template
            >
              <div disable-row [disabled]="disabled">
                <input [value]="value" (blur)="updateValue($event, 'age', rowIndex)" />
                <br />
                <button type="button" (click)="disableRow(rowIndex)">Disable row</button>
              </div>
            </ng-template>
          </ngx-datatable-column>
        </ngx-datatable>
      </div>
    </div>
  `
})
export class DisabledRowsComponent {
  rows: (FullEmployee & { isDisabled?: boolean })[] = [];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('100k.json').subscribe(data => {
      this.rows = data;
    });
  }

  isRowDisabled(row: FullEmployee & { isDisabled?: boolean }) {
    return !(!row.isDisabled && row.age < 40);
  }

  disableRow(rowIndex: number) {
    this.rows[rowIndex].isDisabled = true;
    this.rows = [...this.rows];
  }

  updateValue(event: Event, cell: 'gender' | 'age', rowIndex: number) {
    const target = event.target as HTMLInputElement;
    this.rows = [...this.rows];
    if (cell === 'age' && this.rows[rowIndex][cell] > 40) {
      this.rows[rowIndex].isDisabled = true;
      this.rows[rowIndex].age = target.valueAsNumber;
    }
    if (cell === 'gender' && this.rows[rowIndex][cell] === 'male') {
      this.rows[rowIndex].isDisabled = true;
      this.rows[rowIndex].gender = target.value;
    }
  }
}
