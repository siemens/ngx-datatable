import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivateEvent, DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'cell-selection-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <ngx-datatable
        class="material selection-cell"
        columnMode="force"
        selectionType="cell"
        [rows]="rows | async"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [selected]="selected"
        (selectedChange)="onSelect($event)"
        (activate)="onActivate($event)"
      />
    </div>
  `
})
export class CellSelectionComponent {
  readonly rows = inject(DataService).load('company.json');
  selected: Employee[] = [];
  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];

  onSelect(event: Employee[]) {
    // eslint-disable-next-line no-console
    console.log('Event: select', event, this.selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Event: activate', event);
  }
}
