import { Component, inject } from '@angular/core';
import {
  ActivateEvent,
  DatatableComponent,
  SelectEvent,
  TableColumn
} from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'cell-selection-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Cell Selection
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/selection/selection-cell.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material selection-cell"
        columnMode="force"
        selectionType="cell"
        [rows]="rows"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [selected]="selected"
        (select)="onSelect($event)"
        (activate)="onActivate($event)"
      />
    </div>
  `
})
export class CellSelectionComponent {
  rows: Employee[] = [];
  selected: Employee[] = [];
  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
    });
  }

  onSelect(event: SelectEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Event: select', event, this.selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Event: activate', event);
  }
}
