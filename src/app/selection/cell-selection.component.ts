import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ActivateEvent,
  DatatableComponent,
  SelectEvent,
  TableColumn
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'cell-selection-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <h3>
        Cell Selection
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/selection/cell-selection.component.ts"
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
        [rows]="rows | async"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [selected]="selected"
        (select)="onSelect($event)"
        (activate)="onActivate($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class CellSelectionComponent {
  readonly rows = inject(DataService).load('company.json');
  selected: Employee[] = [];
  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];

  onSelect(event: SelectEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Event: select', event, this.selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Event: activate', event);
  }
}
